import Elysia, { t } from "elysia";
import { soulSyncDbService } from "../../services/db";
import { authenticationService } from "../../services/auth";
import { cacheService } from "../../services/cache";

export const diaryService = new Elysia()
  .use(authenticationService)
  .use(soulSyncDbService)
  .use(cacheService)
  .post(
    "/new-entry",
    async ({ _db, body, session }) => {
      if (!session) return { error: "Unauthorized", status: 401 };

      const { id, email } = session;

      console.log(`Creating new diary entry for user: ${email} (${id})`);

      const { content, date, mood, title } = body;
      const data = await _db.diaryEntry.create({
        data: {
          content,
          date: new Date(date),
          mood,
          title,
          user: {
            connect: {
              id,
            },
          },
        },
      });

      return { message: "New diary entry created", data, status: 201 };
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
        date: t.String(),
        mood: t.String(),
      }),
    }
  )
  .get("/entries", async ({ _db, session, cache }) => {
    if (!session) return { error: "Unauthorized", status: 401 };
    const { id } = session;
    const entries = await cache.getWithCallback(
      `diary-entries-${id}`,
      async () =>
        _db.diaryEntry.findMany({
          where: {
            userId: id,
          },
          orderBy: {
            date: "desc",
          },
        })
    );
    return { message: "Diary entries retrieved", data: entries, status: 200 };
  });
