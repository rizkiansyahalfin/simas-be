import { CorsOptions } from 'cors';
import { Request } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { logger } from './logger';

// CORS
export const corsOptions: CorsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// RATE LIMIT
const windowMs = 15 * 60 * 1000

export const limiter = rateLimit({
  windowMs,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,

  skip: () =>
    process.env.LOAD_TEST === "test",

  message: {
    status: 429,
    error: 'Terlalu banyak request, coba lagi nanti.',
  },

  handler: (req, res) => {
    const userId = (req as Request).user?.id
    const key = userId
      ? `user:${userId}`
      : `ip:${ipKeyGenerator(req.ip!)}`

    logger.warn(`Rate limit exceeded for ${key} — ${req.method} ${req.originalUrl}`, {
      rateLimitExceeded: true,
      key,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: userId ?? undefined,
    })

    res.status(429).json({
      status: 429,
      error: 'Terlalu banyak request, coba lagi nanti.',
    })
  },
});
