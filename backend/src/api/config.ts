import Elysia from "elysia";
import { dbService } from "../services/db";
import { cacheService } from "../services/cache";
// import cron, { Patterns } from "@elysiajs/cron";
import { loggerService } from "../services/logger";
import { GlobalConfig } from "../db/prisma/generated";

export const config = new Elysia()
  .use(dbService)
  .use(cacheService)
  .use(loggerService)
  .resolve({ as: "scoped" }, async ({ db, cache }) => {
    const config = await cache.getWithCallback(
      "config",
      () => {
        return db.globalConfig.findFirst({
          where: {
            isActive: true,
          },
        });
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
        if (timeLeft < 0) {
          cache.delete("config");
          console.log("Maintenance mode ended, updating config in DB");
          const data = await db.globalConfig.update({
            where: { id },
            data: {
              isMaintenanceMode: true,
            },
          });
          cache.set("config", JSON.stringify(data), 1000 * 60 * 60 * 24);
        }
        set.headers["x-maintenance-time-left"] = timeLeft.toString();
        set.headers["x-maintenance-scheduled"] = "true";
        set.headers["x-maintenance-end-time"] = endTime.toString();
        set.headers["content-type"] = "application/json";
      }
    }
  );
