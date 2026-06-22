import rateLimit ,{ipKeyGenerator}from "express-rate-limit"
import {
  RedisStore,
  type RedisReply,
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
        sendCommand: (
          command: string,
          ...args: string[]
        ) => redis.call(command, ...args) as Promise<RedisReply>,
      }),

    keyGenerator:
      (req) => {

        return `admin:${
          req.user?.id ??
          ipKeyGenerator(req.ip!)
        }`
      }
  })