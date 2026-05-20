import type { Request, Response } from "express"
import { PrayerService } from "./prayer.service"
import { prayerQuerySchema } from "./prayer.validation"

export const PrayerController = {
  async getSchedule(req: Request, res: Response) {
    const query = prayerQuerySchema.safeParse(req.query)

    if (!query.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: query.error.format()
      })
    }

    const date = query.data.date ?? new Date().toISOString().split("T")[0]
    const city = query.data.city
    const data = await PrayerService.getSchedule({ date, city })

    return res.json({
      success: true,
      data
    })
  },

  async sync(req: Request, res: Response) {
    const result = await PrayerService.syncMonthly()

    return res.json({
      success: true,
      result
    })
  }
}