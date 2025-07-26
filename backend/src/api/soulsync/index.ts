import Elysia from "elysia";

export const soulSyncApi = new Elysia({
  prefix: "/v1/soulsync",
}).get("/", async () => {});
