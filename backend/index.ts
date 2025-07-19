import { Elysia } from "elysia";
import logger, { loggerService } from "./src/services/logger";
import swagger from "@elysiajs/swagger";
import { apiVersionOne } from "./src/api";

const PORT = process.env.BACKEND_PORT || 5000 ;

new Elysia()
  .use(loggerService)
  .resolve({ as: "scoped" }, ({ logger, request, path }) => {
    logger.info(`Request received ${request.method} ${path}`);
  })
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
  .use(apiVersionOne)
  .listen(PORT, ({ hostname, port }) => {
    logger.info(`Server is running on http://${hostname}:${port}`);
  });
