import prisma from "../../database"
import type { PrayerScheduleInput } from "./prayer.validation"

export const PrayerRepository = {
  async findByDate(date: Date, city: string) {
    return prisma.prayerSchedule.findUnique({
      where: {
        prayerDate_city: {
          prayerDate: date,
          city
        }
      }
    })
  },

  async upsert(data: PrayerScheduleInput) {
    return prisma.prayerSchedule.upsert({
      where: {
        prayerDate_city: {
          prayerDate: data.prayerDate,
          city: data.city
        }
      },
      update: data,
      create: data
    })
  }
}

