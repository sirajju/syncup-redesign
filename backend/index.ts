import { Elysia } from "elysia";
import logger, { loggerService } from "./src/services/logger";
import swagger from "@elysiajs/swagger";

const PORT = process.env.BACKEND_PORT || 3000;

const app = new Elysia()
  .use(loggerService)
  .use(
    swagger({
      autoDarkMode: true,
      documentation: {
        servers: [
          {
            url: `http://localhost:${PORT}`,
            description: "Local server",
          },
        ],
        info: {
          title: "Syncup backend API",
          version: "1.0.0",
          description: "API documentation for the Syncup server",
        },
      },
    })
  )
  .get("/", ({ logger }) => {
    logger.info("Root endpoint accessed");
    return "Welcome to the Elysia server!";
  })
  .listen(PORT, ({ hostname, port }) => {
    logger.info(`Server is running on http://${hostname}:${port}`);
  });
