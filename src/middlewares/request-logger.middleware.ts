import { Request, Response, NextFunction } from "express"

import { logger } from "../config/logger"

export const requestLogger =
(
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const start =
    Date.now()

  res.on(
    "finish",
    () => {

      logger.info(
        "HTTP Request",
        {
          method:
            req.method,

          url:
            req.originalUrl,

          status:
            res.statusCode,

          responseTime:
            Date.now() -
            start,

          ip:
            req.ip,

          userAgent:
            req.headers[
              "user-agent"
            ]
        }
      )
    }
  )

  next()
}