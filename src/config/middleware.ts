import { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';

// CORS
export const corsOptions: CorsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// RATE LIMIT
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Terlalu banyak request, coba lagi nanti.',
  },
});