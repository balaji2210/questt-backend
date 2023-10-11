const { createLogger, format, transports } = require("winston");

const { combine, timestamp, prettyPrint } = format;

/**
 * * Custom Logger
 *
 * @param {string} message
 * @param {string} level
 * @param {string} api
 * @param {number} errorCode
 */
module.exports.consoleLog = (
  message = "Default Log",
  level = "info",
  msgObj = {}
) => {
  const logger = createLogger({
    transports: [
      new transports.Console({
        level:
          process.env.NODE_ENV !== "production" && level === "info"
            ? "debug"
            : "info",
        format: combine(timestamp(), prettyPrint()),
      }),
    ],
    exitOnError: false,
  });
  logger.log(level, message, msgObj);
};
