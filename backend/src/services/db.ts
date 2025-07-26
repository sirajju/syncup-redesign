import { PrismaClient as SyncupClient } from "../db/prisma/syncup/generated/client";
import { PrismaClient as SoulSyncClient } from "../db/prisma/soulsync/generated/client";
import { Elysia } from "elysia";
import logger from "./logger";

const client = new SyncupClient();
const soulSyncClient = new SoulSyncClient();

soulSyncClient
  .$connect()
  .then(() => {
    logger.info("[DIARY DB] Connected successfully");
  })
  .catch((error) => {
    logger.error("Database connection failed:", error);
    process.exit(1);
  });

client
  .$connect()
  .then(() => {
    logger.info("[SYNCUP DB] Connected successfully");
  })
  .catch((error) => {
    logger.error("Database connection failed:", error);
    process.exit(1);
  });
export const soulSyncDbService = new Elysia().decorate("db", soulSyncClient);
export const dbService = new Elysia().decorate("db", client);
