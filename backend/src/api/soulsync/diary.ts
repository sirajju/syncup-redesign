import Elysia, { t } from "elysia";
import { soulSyncDbService } from "../../services/db";
import { authenticationService } from "../../services/auth";
import { cacheService } from "../../services/cache";
import { cryptoService } from "../../services/crypto";
import { SessionSettingsPlain } from "../../db/prisma/soulsync/prismabox/SessionSettings";

const unauthorizedResponse = (set: any) => {
  set.status = 401;
  return { error: "Unauthorized", status: 401 };
};

const errorResponse = (set: any, message: string, status: number = 500) => {
  set.status = status;
  return { error: message, status };
};

const CACHE_TTL = {
  DIARY_ENTRIES: 60 * 5, // 5 minutes
  APP_CONFIG: 60 * 10, // 10 minutes
} as const;

export const diaryService = new Elysia()
  .use(authenticationService)
  .use(soulSyncDbService)
  .use(cacheService)
  .use(cryptoService)
  .post(
    "/new-entry",
    async ({ _db, body, session, set, cache }) => {
      if (!session) return unauthorizedResponse(set);

      const { id } = session;
      const {
        content,
        date,
        mood,
        title,
        keyPoints = [],
        favorite = false,
      } = body;

      const entryDate = new Date(date);
      if (isNaN(entryDate.getTime())) {
        return errorResponse(set, "Invalid date format", 400);
      }

      try {
        const data = await _db.diaryEntry.create({
          data: {
            content,
            date: entryDate,
            mood,
            favorite,
            title,
            keyPoints,
            keyPointsCount: keyPoints.length,
            user: {
              connect: { id },
            },
          },
          select: {
            id: true,
            title: true,
            content: true,
            date: true,
            mood: true,
            keyPoints: true,
            keyPointsCount: true,
            favorite: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        await cache.delete(`diary-entries-${id}`);

        return {
          message: "New diary entry created successfully",
          data,
          status: 201,
        };
      } catch (error) {
        return errorResponse(set, "Failed to create diary entry");
      }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 200 }),
        content: t.String({ minLength: 1, maxLength: 10000 }),
        date: t.String({ format: "date-time" }),
        mood: t.String({ minLength: 1, maxLength: 50 }),
        keyPoints: t.Array(t.String({ maxLength: 200 }), {
          optional: true,
          maxItems: 10,
        }),
        favorite: t.Boolean({ optional: true, default: false }),
      }),
    }
  )
  .get("/entries", async ({ _db, session, cache, crypto, set }) => {
    if (!session) return unauthorizedResponse(set);

    const { id, sessionId } = session;

    try {
      const entries = await cache.getWithCallback(
        `diary-entries-${id}`,
        async () => {
          const [diaryEntries, userConfig] = await Promise.all([
            _db.diaryEntry.findMany({
              where: { userId: id },
              orderBy: { date: "desc" },
              select: {
                id: true,
                title: true,
                content: true,
                date: true,
                mood: true,
                keyPoints: true,
                keyPointsCount: true,
                favorite: true,
                createdAt: true,
                updatedAt: true,
              },
            }),
            _db.sessionSettings.findUnique({
              where: { sessionId },
              select: { pubKey: true },
            }),
          ]);

          // Handle encryption if public key exists
          if (userConfig?.pubKey && userConfig.pubKey !== "{}") {
            try {
              const pubKeyString =
                typeof userConfig.pubKey === "string"
                  ? userConfig.pubKey
                  : JSON.stringify(userConfig.pubKey);
              const pubKey = JSON.parse(pubKeyString);
              return await crypto.encrypt(JSON.stringify(diaryEntries), pubKey);
            } catch (encryptionError) {
              console.error("Encryption error:", encryptionError);
              return diaryEntries;
            }
          }
          return diaryEntries;
        },
        CACHE_TTL.DIARY_ENTRIES
      );

      return {
        message: "Diary entries retrieved successfully",
        data: entries,
        status: 200,
      };
    } catch (error) {
      console.error("Error retrieving diary entries:", error);
      return errorResponse(set, "Failed to retrieve diary entries");
    }
  })
  .get(
    "/entry/:id",
    async ({ _db, params, session, set }) => {
      if (!session) return unauthorizedResponse(set);

      const { id: userId } = session;
      const { id: entryId } = params;

      try {
        const entry = await _db.diaryEntry.findFirst({
          where: {
            id: entryId,
            userId: userId,
          },
          select: {
            id: true,
            title: true,
            content: true,
            date: true,
            mood: true,
            keyPoints: true,
            keyPointsCount: true,
            favorite: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!entry) {
          return errorResponse(set, "Entry not found or unauthorized", 404);
        }

        return {
          message: "Diary entry retrieved successfully",
          data: entry,
          status: 200,
        };
      } catch (error) {
        console.error("Error retrieving diary entry:", error);
        return errorResponse(set, "Failed to retrieve diary entry");
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .get("/app-config", async ({ _db, session, cache, set }) => {
    if (!session) return unauthorizedResponse(set);

    const { id, sessionId } = session;

    try {
      const config = await cache.getWithCallback(
        `user-app-config-${id}`,
        async () => {
          const config = await _db.sessionSettings.findUnique({
            where: { sessionId },
            select: {
              id: true,
              sessionId: true,
              pubKey: true,
              theme: true,
              language: true,
              pushEnabled: true,
              timezone: true,
              notificationsEnabled: true,
              privacySettings: true,
              securitySettings: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          });
          return config;
        },
        CACHE_TTL.APP_CONFIG
      );

      return {
        message: "App configuration retrieved successfully",
        data: config,
        status: 200,
      };
    } catch (error) {
      console.error("Error retrieving app config:", error);
      return errorResponse(set, "Failed to retrieve app configuration");
    }
  })
  .put(
    "/app-config",
    async ({ _db, body, session, set, cache }) => {
      if (!session) return unauthorizedResponse(set);

      const { id, sessionId } = session;

      try {
        const filteredBody = Object.fromEntries(
          Object.entries(body).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(filteredBody).length === 0) {
          return errorResponse(set, "No valid configuration provided", 400);
        }

        const config = await _db.sessionSettings.upsert({
          where: { sessionId },
          update: { ...filteredBody },
          create: {
            ...filteredBody,
            sessionId,
          },
          select: {
            id: true,
            sessionId: true,
            pubKey: true,
            theme: true,
            language: true,
            pushEnabled: true,
            timezone: true,
            notificationsEnabled: true,
            privacySettings: true,
            securitySettings: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        await Promise.all([
          cache.delete(`user-app-config-${id}`),
          cache.delete(`diary-entries-${id}`),
        ]);

        return {
          message: "App configuration updated successfully",
          data: config,
          status: 200,
        };
      } catch (error) {
        console.error("Error updating app config:", error);
        return errorResponse(set, "Failed to update app configuration");
      }
    },
    {
      body: t.Partial(SessionSettingsPlain),
    }
  )
  .delete(
    "/delete-entry/:id",
    async ({ _db, params, session, set, cache }) => {
      if (!session) return unauthorizedResponse(set);

      const { id: userId } = session;
      const { id: entryId } = params;

      try {
        const deleteResult = await _db.diaryEntry.deleteMany({
          where: {
            id: entryId,
            userId: userId,
          },
        });

        if (deleteResult.count === 0) {
          return errorResponse(set, "Entry not found or unauthorized", 404);
        }

        await cache.delete(`diary-entries-${userId}`);

        return {
          message: "Diary entry deleted successfully",
          status: 200,
        };
      } catch (error) {
        console.error("Error deleting diary entry:", error);
        return errorResponse(set, "Failed to delete diary entry");
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .patch(
    "/update-entry/:id",
    async ({ _db, params, body, session, set, cache }) => {
      if (!session) return unauthorizedResponse(set);

      const { id: userId } = session;
      const { id: entryId } = params;

      try {
        const updateData: any = {};

        if (body.title !== undefined) updateData.title = body.title;
        if (body.content !== undefined) updateData.content = body.content;
        if (body.mood !== undefined) updateData.mood = body.mood;
        if (body.favorite !== undefined) updateData.favorite = body.favorite;
        if (body.keyPoints !== undefined) {
          updateData.keyPoints = body.keyPoints;
          updateData.keyPointsCount = body.keyPoints.length;
        }
        if (body.date !== undefined) {
          const entryDate = new Date(body.date);
          if (isNaN(entryDate.getTime())) {
            return errorResponse(set, "Invalid date format", 400);
          }
          updateData.date = entryDate;
        }

        if (Object.keys(updateData).length === 0) {
          return errorResponse(set, "No valid updates provided", 400);
        }

        const updatedEntry = await _db.diaryEntry.updateMany({
          where: {
            id: entryId,
            userId: userId,
          },
          data: updateData,
        });

        if (updatedEntry.count === 0) {
          return errorResponse(set, "Entry not found or unauthorized", 404);
        }

        const entry = await _db.diaryEntry.findUnique({
          where: { id: entryId },
          select: {
            id: true,
            title: true,
            content: true,
            date: true,
            mood: true,
            keyPoints: true,
            keyPointsCount: true,
            favorite: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        await cache.delete(`diary-entries-${userId}`);

        return {
          message: "Diary entry updated successfully",
          data: entry,
          status: 200,
        };
      } catch (error) {
        console.error("Error updating diary entry:", error);
        return errorResponse(set, "Failed to update diary entry");
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Partial(
        t.Object({
          title: t.String({ minLength: 1, maxLength: 200 }),
          content: t.String({ minLength: 1, maxLength: 10000 }),
          date: t.String({ format: "date-time" }),
          mood: t.String({ minLength: 1, maxLength: 50 }),
          keyPoints: t.Array(t.String({ maxLength: 200 }), { maxItems: 10 }),
          favorite: t.Boolean(),
        })
      ),
    }
  );
