import Elysia from "elysia";
import { config } from "./config";
import { auth } from "./auth";
import { diaryService } from "./diary";

export const soulSyncApi = new Elysia({
  prefix: "/v1/soulsync",
})
  // .use(config)
  .use(auth)
  .use(diaryService)
