const { createLogger, transports, format } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const formatter = printf((info) => {
  return `${info.timestamp} [${info.level}] ${info.message} `;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: `MMM-DD-YYYY HH:mm:ss` }),
    formatter,
    colorize()
  ),
  transports: [
    new transports.Console({
      level: "debug",
      json: true,
      format: combine(colorize(), timestamp(), formatter),
      timestamp: timestamp,
      prettyPrint: true,
    }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/general.log", level: "info" }),
  ],
});

module.exports = logger;
