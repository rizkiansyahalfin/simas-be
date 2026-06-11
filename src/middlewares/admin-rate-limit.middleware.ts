import rateLimit from "express-rate-limit"
import {
  RedisStore
} from "rate-limit-redis"

import redis from "../lib/redis"

export const adminRateLimitMiddleware =
  rateLimit({

    windowMs:
      60 * 60 * 1000,

    max: 5,

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

        return `admin:${
          req.user?.id ??
          req.ip
        }`
      }
  })