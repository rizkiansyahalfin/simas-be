import { PrayerProvider } from "./prayer.provider"
import { PrayerRepository } from "./prayer.repository"
import { prayerScheduleSchema } from "./prayer.validation"
import type { PrayerData } from "./prayer.type"

const DEFAULT_CITY = "Jakarta"
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 1000

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const convertToPrayerDate = (value: unknown): Date => {
  if (value instanceof Date) return value
  if (typeof value === "string") {
    const parsed = new Date(value)
    if (!isNaN(parsed.getTime())) return parsed
  }
  throw new Error("INVALID_PRAYER_TIME")
}

export const PrayerService = {
  async syncToday() {
    const city = DEFAULT_CITY
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await PrayerRepository.findByDate(today, city)
    if (existing) {
      console.log(`Prayer data already synced for ${city} on ${today}`)
      return existing
    }

    const data = await this.fetchWithRetry(city)
    const payload = prayerScheduleSchema.parse({
      prayerDate: today,
      city,
      subuh: convertToPrayerDate(data.subuh),
      dzuhur: convertToPrayerDate(data.dzuhur),
      ashar: convertToPrayerDate(data.ashar),
      maghrib: convertToPrayerDate(data.maghrib),
      isya: convertToPrayerDate(data.isya)
    })

    return PrayerRepository.create(payload)
  },

  async fetchWithRetry(city: string, attempt = 1): Promise<PrayerData> {
    try {
      return await PrayerProvider.fetch(city)
    } catch (err) {
      if (attempt >= MAX_RETRY_ATTEMPTS) {
        console.error(
          `Failed to fetch prayer data for ${city} after ${MAX_RETRY_ATTEMPTS} attempts:`,
          err
        )
        throw new Error("FAILED_FETCH_PRAYER", { cause: err })
      }

      console.warn(
        `Attempt ${attempt}/${MAX_RETRY_ATTEMPTS} failed, retrying in ${RETRY_DELAY_MS}ms...`,
        err
      )
      await sleep(RETRY_DELAY_MS)
      return this.fetchWithRetry(city, attempt + 1)
    }
  }
}
