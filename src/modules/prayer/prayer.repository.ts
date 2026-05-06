import prisma from "../../database"
import type { PrayerScheduleInput } from "./prayer.validation"

export const PrayerRepository = {
  async findByDate(date: Date, city: string) {
    return prisma.prayerSchedule.findFirst({
      where: {
        prayerDate: date,
        city
      }
    })
  },

  async create(data: PrayerScheduleInput) {
    return prisma.prayerSchedule.create({ data })
  }
}
