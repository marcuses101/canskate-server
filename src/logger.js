const winston = require("winston");
const { NODE_ENV } = require("./config");
const path = require("path");

const filename = path.join(__dirname, "created-logfile.log");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename })],
});

if (NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize()
      ),
    })
  );
}

module.exports = logger;
