import cron from "node-cron"
import { PrayerService } from "./prayer.service"

export const startPrayerJob = () => {
  cron.schedule("0 5 * * *", async () => {
    console.log("Running prayer cron...")

    try {
      await PrayerService.syncToday()
    } catch (err) {
      console.error("Cron failed:", err)
    }
  })
}