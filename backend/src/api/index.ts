import Elysia from "elysia";
import { auth } from "./auth";

export const apiVersionOne = new Elysia({
  prefix: "/api/v1",
})
  .use(auth)
  .get("/test", ({ request }) => {
    console.log(request.headers);
    return { status: 200 };
  });
