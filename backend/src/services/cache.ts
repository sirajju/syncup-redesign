import Redis from "ioredis";
import logger from "./logger";
import Elysia from "elysia";

const connection = new Redis(process.env.REDIS!);

connection.on("connect", () => {
  logger.info("Connected to Redis");
});

connection.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

export const cacheService = new Elysia().decorate("cache", connection);
