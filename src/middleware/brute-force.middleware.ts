import rateLimit from "express-rate-limit"
import { Request, Response, NextFunction } from "express"

import { securityConfig } from "../config/security.config"

const {
  enabled,
  maxAttempts,
  windowMinutes
} = securityConfig.bruteForce

export const bruteForceMiddleware = enabled

  ? rateLimit({

      windowMs: windowMinutes * 60 * 1000,

      max: maxAttempts,

      standardHeaders: true,

      legacyHeaders: false,

      message: {
        success: false,
        message:
          "Terlalu banyak percobaan login. Coba lagi nanti."
      }

    })

  : (req: Request, res: Response, next: NextFunction) => next()