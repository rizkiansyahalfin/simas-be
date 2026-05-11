export type {
  PrayerScheduleInput,
  PrayerQueryInput,
  PrayerConfigInput
} from "./prayer.validation"

export interface PrayerData {
  subuh: string | Date
  dzuhur: string | Date
  ashar: string | Date
  maghrib: string | Date
  isya: string | Date
}

