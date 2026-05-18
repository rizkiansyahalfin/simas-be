import { PrayerProvider } from "./prayer.provider"
import { PrayerRepository } from "./prayer.repository"
import { createPrayerTime } from "./prayer.util"
import { prayerConfig } from "./prayer.config"

export const PrayerService = {
  async syncMonthly() {
    const now = new Date()

    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const data = await PrayerProvider.fetchMonthlySchedule(
      prayerConfig.province,
      prayerConfig.city,
      month,
      year
    )

    const payload = data.jadwal.map((item) => ({
      prayerDate: new Date(item.tanggal_lengkap),
      city: data.kabkota,
      subuh: createPrayerTime(item.tanggal_lengkap, item.subuh),
      dzuhur: createPrayerTime(item.tanggal_lengkap, item.dzuhur),
      ashar: createPrayerTime(item.tanggal_lengkap, item.ashar),
      maghrib: createPrayerTime(item.tanggal_lengkap, item.maghrib),
      isya: createPrayerTime(item.tanggal_lengkap, item.isya)
    }))

    return PrayerRepository.createMany(payload)
  },

  async getSchedule({ date, city }: { date: string; city?: string }) {
    const parsedDate = new Date(date)
    parsedDate.setHours(0, 0, 0, 0)

    return PrayerRepository.findSchedule(
      parsedDate,
      city ?? prayerConfig.city
    )
  }
}
