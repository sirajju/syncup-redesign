import Elysia from "elysia";
import { soulSyncDbService } from "../../services/db";
import { cacheService } from "../../services/cache";
import { loggerService } from "../../services/logger";
import { GlobalConfig } from "../../db/prisma/syncup/generated";

export const config = new Elysia()
  .use(soulSyncDbService)
  .use(cacheService)
  .use(loggerService)
  .resolve({ as: "scoped" }, async ({ db, cache }) => {
    const config = await cache.getWithCallback(
      "config",
      () => {
        return db.globalConfig.findFirst();
      },
      1000 * 60 * 60 * 24
    );
    return {
      config: JSON.parse(config) as GlobalConfig,
    };
  })
  // .use(
  //   cron({
  //     name: "maintenance",
  //     pattern: Patterns.EVERY_MINUTE,
  //     paused: true,
  //     run({ options, fn }) {
  //       console.log("Checking maintenance mode status...", fn);
  //     },
  //   })
  // )
  .resolve(
    { as: "scoped" },
    async ({ logger, request, path, config, status, set, db, cache }) => {
      logger.info(`Request received ${request.method} ${path}`);
      const {
        id,
        isMaintenanceMode,
        maintenanceStartTime,
        isMaintenanceScheduled,
        maintenanceEndTime,
      } = config;
      if (isMaintenanceMode) {
        logger.error(
          "Maintenance mode is enabled. No requests will be processed."
        );
        return status(503, "Maintenance mode is enabled");
      }
      if (
        isMaintenanceScheduled &&
        maintenanceStartTime &&
        maintenanceEndTime
      ) {
        const timeLeft = new Date(maintenanceStartTime).getTime() - Date.now();
        const endTime = new Date(maintenanceEndTime).getTime();
        // if (timeLeft < 0) {
        //   cache.delete("config");
        //   const data = await db.globalConfig.update({
        //     where: { id },
        //   });
        //   cache.set("config", JSON.stringify(data), 1000 * 60 * 60 * 24);
        // }
        set.headers["x-maintenance-time-left"] = timeLeft.toString();
        set.headers["x-maintenance-scheduled"] = "true";
        set.headers["x-maintenance-end-time"] = endTime.toString();
        set.headers["content-type"] = "application/json";
      }
    }
  );
