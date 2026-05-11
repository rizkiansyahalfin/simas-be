import { PrayerProvider } from "./prayer.provider"
import { PrayerRepository } from "./prayer.repository"
import { prayerConfig, updatePrayerConfig } from "./prayer.config"
import { prayerScheduleSchema } from "./prayer.validation"
import type {
  PrayerConfigInput,
  PrayerData
} from "./prayer.type"

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 1000

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const parsePrayerDate = (value: string): Date => {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("INVALID_PRAYER_DATE")
  }

  parsed.setHours(0, 0, 0, 0)
  return parsed
}

const convertPrayerTime = (time: string): Date => {
  const clean = time.trim().split(" ")[0]
  const parsed = new Date(`1970-01-01T${clean}:00`)

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("INVALID_PRAYER_TIME")
  }

  return parsed
}

const convertToPrayerDate = (value: unknown): Date => {
  if (value instanceof Date) return value

  if (typeof value === "string") {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }

    return convertPrayerTime(value)
  }

  throw new Error("INVALID_PRAYER_TIME")
}

const normalizeCity = (city?: string) =>
  city?.trim() || prayerConfig.city

export const PrayerService = {
  async getPrayer(date: string, city?: string) {
    const prayerDate = parsePrayerDate(date)
    const normalizedCity = normalizeCity(city)

    return PrayerRepository.findByDate(prayerDate, normalizedCity)
  },

  async updateConfig(payload: PrayerConfigInput) {
    return updatePrayerConfig(payload)
  },

  async syncToday() {
    const city = prayerConfig.city
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await PrayerRepository.findByDate(today, city)
    if (existing) {
      console.log(`Prayer data already synced for ${city} on ${today.toISOString().slice(0, 10)}`)
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

    return PrayerRepository.upsert(payload)
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

