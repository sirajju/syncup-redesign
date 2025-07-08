import { Elysia } from "elysia";
import winston from "winston";

const stripAnsi = (str: string) => {
  return str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, "");
};

const smileFace = (type: any) => {
  type = stripAnsi(type);
  switch (type) {
    case "info":
      return "🤠";
    case "error":
      return "😡";
    case "warn":
      return "😱";
    default:
      return "😇";
  }
};

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "blue",
  debug: "green",
});

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) =>
        `${new Date(Date.now()).toLocaleString()} --> ${smileFace(
          info.level
        )} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: Bun.fileURLToPath(import.meta.resolve("../logs/error.log")),
      level: "error",
    }),
    new winston.transports.File({
      filename: Bun.fileURLToPath(import.meta.resolve("../logs/combined.log")),
      level: "info",
    }),
  ],
});

export const loggerService = new Elysia().decorate("logger", winstonLogger);
export default winstonLogger;
