// prayer.repository.ts

import prisma from "../../database"
import type { PrayerScheduleInput } from "./prayer.validation"

export const PrayerRepository = {
  async createMany(data: PrayerScheduleInput[]) {
    return prisma.prayerSchedule.createMany({
      data,
      skipDuplicates: true
    })
  },

  async findSchedule(date: Date, city: string) {
    return prisma.prayerSchedule.findFirst({
      where: {
        prayerDate: date,
        city
      }
    })
  },

  async findWeeklySchedules(
    startDate: Date,
    endDate: Date,
    city: string
  ) {
    return prisma.prayerSchedule.findMany({
      where: {
        city,
        prayerDate: {
          gte: startDate,
          lte: endDate
        }
      },

      orderBy: {
        prayerDate: "asc"
      }
    })
  }
}