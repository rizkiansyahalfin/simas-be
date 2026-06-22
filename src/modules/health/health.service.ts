// health.service.ts

import prisma from "../../database"
import redisClient from "../../lib/redis"

import os from "os"

import { getDiskInfo }
from "../../utils/disk.util"

export const HealthService = {

  async checkDatabase() {

    const start = Date.now()

    try {

      await prisma.$queryRaw`
        SELECT 1
      `

      return {
        status: "up" as const,
        responseTime:
          Date.now() - start
      }

    } catch {

      return {
        status: "down" as const,
        responseTime:
          Date.now() - start
      }
    }
  },

  async checkRedis() {

    const start = Date.now()

    try {

      await redisClient.ping()

      return {
        status: "up" as const,
        responseTime:
          Date.now() - start
      }

    } catch {

      return {
        status: "down" as const,
        responseTime:
          Date.now() - start
      }
    }
  },

  async getBasicHealth() {

    const [
      database,
      redis,
      disk
    ] = await Promise.all([

      this.checkDatabase(),

      this.checkRedis(),

      getDiskInfo()
    ])

    const status =
      database.status === "up" &&
      redis.status === "up"
        ? "healthy"
        : "degraded"

    return {

      status,

      uptime:
        Math.floor(
          process.uptime()
        ),

      database,

      redis,

      disk
    }
  },

  async getDetailedHealth() {

    const basic = await this.getBasicHealth()

    const userCount = await prisma.user.count()
    const congregationCount = await prisma.congregation.count()
    const donationCount = await prisma.donation.count()
    const eventCount = await prisma.event.count()


    return {

      ...basic,

      node: {
        version:
          process.version,

        pid:
          process.pid,

        platform:
          process.platform
      },

      memory: {

        total:
          os.totalmem(),

        free:
          os.freemem(),

        used:
          os.totalmem() -
          os.freemem()
      },

      cpu: {

        cores:
          os.cpus().length,

        load:
          os.loadavg()
      },

      statistics: {
        users: userCount,
        congregations: congregationCount,
        events: eventCount,
        donations: donationCount
      },

      environment:
        process.env.NODE_ENV
    }
  }
}