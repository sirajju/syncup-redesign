import Elysia from "elysia";
import { auth } from "./auth";
import { config } from "./config";
import { syncupApi } from "./syncup";
import { soulSyncApi } from "./soulsync";

export const apiVersionOne = new Elysia({
  prefix: "/api",
})
  // Common apis for auth & config
  .use(config)
  .use(auth)
  // Individual apis for diff apps
  .use(syncupApi)
  .use(soulSyncApi);
