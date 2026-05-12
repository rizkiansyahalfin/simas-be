import rateLimit from "express-rate-limit";
import { securityConfig } from "../config/security.config";
const { enabled, maxAttempts, windowMinutes } = securityConfig.bruteForce;
const windowMs = Math.max(1, windowMinutes) * 60 * 1000;
const bruteForceOptions = {
    windowMs,
    max: maxAttempts,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Terlalu banyak percobaan login. Coba lagi nanti."
        });
    }
};
export const bruteForceMiddleware = enabled
    ? rateLimit(bruteForceOptions)
    : ((req, res, next) => next());
