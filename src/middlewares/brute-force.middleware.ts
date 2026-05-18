import rateLimit from "express-rate-limit"
import type { RequestHandler } from "express"
import { Request, Response, NextFunction } from "express"

import { securityConfig } from "../config/security.config"

const {
  enabled,
  maxAttempts,
  windowMinutes
} = securityConfig.bruteForce

const windowMs = Math.max(1, windowMinutes) * 60 * 1000

const bruteForceOptions = {
  windowMs,
  max: maxAttempts,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Terlalu banyak percobaan login. Coba lagi nanti."
    })
  }
}

export const bruteForceMiddleware: RequestHandler = enabled
  ? rateLimit(bruteForceOptions)
  : ((req: Request, res: Response, next: NextFunction) => next())