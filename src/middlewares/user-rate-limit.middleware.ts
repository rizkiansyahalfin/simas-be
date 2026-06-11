import rateLimit from "express-rate-limit"
import {
  RedisStore
} from "rate-limit-redis"

import redis from "../lib/redis"

export const userRateLimitMiddleware =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 100,

    standardHeaders:
      true,

    legacyHeaders:
      false,

    store:
      new RedisStore({

        sendCommand:
          (...args: string[]) =>
            redis.call(
              ...args
            )
      }),

    keyGenerator:
      (req) => {

        if (
          req.user?.id
        ) {

          return `user:${req.user.id}`
        }

        return `ip:${req.ip}`
      },

    handler:
      (
        _req,
        res
      ) => {

        return res.status(429)
          .json({

            success: false,

            error_code:
              "RATE_LIMIT_EXCEEDED"
          })
      }
  })