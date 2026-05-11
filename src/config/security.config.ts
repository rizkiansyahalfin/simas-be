export const securityConfig = {

  bruteForce: {
    enabled: process.env.BRUTE_FORCE_ENABLED === "true",

    maxAttempts: Number(
      process.env.BRUTE_FORCE_MAX || 5
    ),

    windowMinutes: Number(
      process.env.BRUTE_FORCE_WINDOW || 15
    )
  }

}