import cron from "node-cron"
import { PrayerService } from "./prayer.service"

export const startPrayerJob = () => {

  cron.schedule("0 0 1 * *", async () => {
    console.log("Running monthly prayer sync...")

    try {
      await PrayerService.syncMonthly()
    } catch (err) {
      console.error(err)
    }
  })

}