import path from "path"

import winston from "winston"

import DailyRotateFile from "winston-daily-rotate-file"

const logDir =
  path.join(
    process.cwd(),
    "logs"
  )

const logFormat =
  winston.format.combine(

    winston.format.timestamp(),

    winston.format.errors({
      stack: true
    }),

    winston.format.json()
  )

const dailyTransport =
  new DailyRotateFile({

    dirname:
      logDir,

    filename:
      "app-%DATE%.log",

    datePattern:
      "YYYY-MM-DD",

    maxFiles:
      "30d",

    zippedArchive:
      true,

    level:
      "info"
  })

const errorTransport =
  new DailyRotateFile({

    dirname:
      logDir,

    filename:
      "error-%DATE%.log",

    datePattern:
      "YYYY-MM-DD",

    maxFiles:
      "60d",

    zippedArchive:
      true,

    level:
      "error"
  })

export const logger =
  winston.createLogger({

    level:
      process.env.LOG_LEVEL ===
      "production"
        ? "info"
        : "debug",

    format:
      logFormat,

    defaultMeta: {
      service:
        "masjid-api"
    },

    transports: [

      dailyTransport,

      errorTransport
    ]
  })

if (
  process.env.NODE_ENV !==
  "production"
) {

  logger.add(
    new winston.transports.Console({

      format:
        winston.format.combine(

          winston.format.colorize(),

          winston.format.timestamp(),

          winston.format.printf(
            ({
              level,
              message,
              timestamp
            }) =>
              `${timestamp} ${level}: ${message}`
          )
        )
    })
  )
}

logger.exceptions.handle(

  new DailyRotateFile({

    dirname:
      logDir,

    filename:
      "exceptions-%DATE%.log",

    datePattern:
      "YYYY-MM-DD",

    maxFiles:
      "60d"
  })
)

logger.rejections.handle(

  new DailyRotateFile({

    dirname:
      logDir,

    filename:
      "rejections-%DATE%.log",

    datePattern:
      "YYYY-MM-DD",

    maxFiles:
      "60d"
  })
)