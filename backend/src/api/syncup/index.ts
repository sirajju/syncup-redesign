import Elysia from "elysia";
import { config } from "./config";
import { auth } from "./auth";

export const syncupApi = new Elysia({
  prefix: "/syncup",
})
  .use(config)
  .use(auth);
