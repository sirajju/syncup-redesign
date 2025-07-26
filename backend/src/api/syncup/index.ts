import Elysia from "elysia";

export const syncupApi = new Elysia({
  prefix: "/syncup",
}).get("/", async () => {});
