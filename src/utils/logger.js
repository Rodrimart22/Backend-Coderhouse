import winston from "winston";
import config from "../config/config.js";

let logger;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "gray",
    error: "red",
    warning: "yellow",
    info: "green",
    debug: "blue",
    http: "magenta",
    debug: "cyan",
  },
};

if (config.environment === "DEVELOPMENT") {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: customLevelOptions.colors,
          }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: customLevelOptions.colors,
          }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "logs/errors.log",
        level: "error",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: customLevelOptions.colors,
          }),
          winston.format.simple()
        ),
      }),
    ],
  });
}

// Creacion de logger
// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console({ leve: "http" }),
//     new winston.transports.File({ filename: "./errors.log", level: "warn" }),
//   ],
// });

// Logger como middleware
export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleDateString}`
  );
  next();
};
