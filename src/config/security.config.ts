interface BruteForceConfig {
  enabled: boolean
  maxAttempts: number
  windowMinutes: number
}

interface SecurityConfig {
  bruteForce: BruteForceConfig
}

const parsePositiveInt = (
  value: string | undefined,
  fallback: number
): number => {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const bruteForce: BruteForceConfig = {
  enabled: process.env.BRUTE_FORCE_ENABLED?.toLowerCase() === "true",
  maxAttempts: clamp(parsePositiveInt(process.env.BRUTE_FORCE_MAX, 5), 1, 50),
  windowMinutes: clamp(parsePositiveInt(process.env.BRUTE_FORCE_WINDOW, 15), 1, 1440)
}

export const securityConfig: SecurityConfig = {
  bruteForce
}