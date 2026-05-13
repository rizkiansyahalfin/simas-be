const parsePositiveInt = (value, fallback) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }
    return parsed;
};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const bruteForce = {
    enabled: process.env.BRUTE_FORCE_ENABLED?.toLowerCase() === "true",
    maxAttempts: clamp(parsePositiveInt(process.env.BRUTE_FORCE_MAX, 5), 1, 50),
    windowMinutes: clamp(parsePositiveInt(process.env.BRUTE_FORCE_WINDOW, 15), 1, 1440)
};
export const securityConfig = {
    bruteForce
};
