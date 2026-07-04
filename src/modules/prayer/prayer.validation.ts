import { z } from "zod"

const timeSchema = z.date().optional()

export const prayerScheduleSchema = z.object({
  prayerDate: z.date(),
  city: z.string().trim().min(1).max(100),
  subuh: timeSchema,
  dzuhur: timeSchema,
  ashar: timeSchema,
  maghrib: timeSchema,
  isya: timeSchema
})

export const prayerQuerySchema = z.object({
  date: z.string().trim().optional(),
  city: z.string().trim().min(1).max(100).optional()
})

export const prayerConfigSchema = z.object({
  city: z.string().trim().min(1).max(100).optional(),
  enabled: z.boolean().optional()
})

export type PrayerScheduleInput = z.infer<typeof prayerScheduleSchema>
export type PrayerQueryInput = z.infer<typeof prayerQuerySchema>
export type PrayerConfigInput = z.infer<typeof prayerConfigSchema>

