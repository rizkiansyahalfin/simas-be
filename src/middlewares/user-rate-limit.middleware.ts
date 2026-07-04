import rateLimit, {ipKeyGenerator} from "express-rate-limit"
import {
  RedisStore,
  type RedisReply,
} from "rate-limit-redis"

import redis from "../lib/redis"

export const userRateLimitMiddleware =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,

    skip: () => {
    console.log(
      "LOAD_TEST =",
      process.env.LOAD_TEST
    )

    return process.env.LOAD_TEST === "test"
  },

    store:
      new RedisStore({
        sendCommand: (
          command: string,
          ...args: string[]
        ) => redis.call(command, ...args) as Promise<RedisReply>,
      }),

    keyGenerator:
      (req) => {

        if (
          req.user?.id
        ) {

          return `user:${req.user.id}`
        }

        return `ip:${ipKeyGenerator(req.ip!)}`
      },

    handler: (_req, res) => {
      return res.status(429).json({
        success: false,
        error_code: "RATE_LIMIT_EXCEEDED",
        message: "Terlalu banyak request, coba lagi nanti.",
      })
    }
  })