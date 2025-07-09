import { PrismaClient } from "../db/prisma/generated/client";
import { Elysia } from "elysia";
import logger from "./logger";

const client = new PrismaClient();

client
  .$connect()
  .then(() => {
    logger.info("[DB] Connected successfully");
  })
  .catch((error) => {
    logger.error("Database connection failed:", error);
    process.exit(1);
  });

export const dbService = new Elysia().decorate("db", client);
