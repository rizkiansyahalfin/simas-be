export interface PrayerConfig {
  city: string
  enabled: boolean
}

const parseString = (
  value: string | undefined,
  fallback: string
): string => {
  const normalized = value?.trim()
  return normalized && normalized.length > 0 ? normalized : fallback
}

const parseBoolean = (value: string | undefined): boolean =>
  value?.toLowerCase() === "true"

export const prayerConfig: PrayerConfig = {
  city: parseString(process.env.PRAYER_CITY, "Jakarta"),
  enabled: parseBoolean(process.env.PRAYER_SYNC_ENABLED)
}

export const updatePrayerConfig = (
  config: Partial<PrayerConfig>
): PrayerConfig => {
  if (config.city !== undefined) {
    prayerConfig.city = parseString(config.city, prayerConfig.city)
  }

  if (typeof config.enabled === "boolean") {
    prayerConfig.enabled = config.enabled
  }

  return prayerConfig
}
