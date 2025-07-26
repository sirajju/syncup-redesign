import Elysia from "elysia";
import { config } from "./config";
import { auth } from "./auth";

export const soulSyncApi = new Elysia({
  prefix: "/v1/soulsync",
})
  .use(config)
  .use(auth);
