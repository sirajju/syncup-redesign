import { Elysia } from "elysia";
import logger, { loggerService } from "./src/services/logger";

const PORT = process.env.BACKEND_PORT || 3000;

const app = new Elysia()
  .use(loggerService)
  .get("/", ({ logger }) => {
    logger.info("Root endpoint accessed");
    return "Welcome to the Elysia server!";
  })
  .listen(PORT, ({ hostname, port }) => {
    logger.info(`Server is running on http://${hostname}:${port}`);
  });
