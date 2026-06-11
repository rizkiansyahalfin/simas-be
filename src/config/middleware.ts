import { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';

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
  message: {
    status: 429,
    error: 'Terlalu banyak request, coba lagi nanti.',
  },
});