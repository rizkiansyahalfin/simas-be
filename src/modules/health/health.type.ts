// health.type.ts

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"

  uptime: number

  database: {
    status: "up" | "down"
    responseTime: number
  }

  redis: {
    status: "up" | "down"
    responseTime: number
  }

  disk: {
    free: number
    size: number
    usedPercentage: number
  }
}