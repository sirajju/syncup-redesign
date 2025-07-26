import Elysia from "elysia";
import { syncupApi } from "./syncup";
import { soulSyncApi } from "./soulsync";

export const apiVersionOne = new Elysia({
  prefix: "/api",
})
  // Individual apis for diff apps
  .use(syncupApi)
  .use(soulSyncApi);
