import { z } from "zod";
const timeSchema = z.date().optional();
export const prayerScheduleSchema = z.object({
    prayerDate: z.date(),
    city: z.string().trim().min(1).max(100),
    subuh: timeSchema,
    dzuhur: timeSchema,
    ashar: timeSchema,
    maghrib: timeSchema,
    isya: timeSchema
});
