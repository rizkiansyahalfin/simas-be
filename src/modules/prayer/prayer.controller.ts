import { Request, Response, NextFunction } from "express"

import { PrayerService } from "./prayer.service"
import {
  prayerConfigSchema,
  prayerQuerySchema
} from "./prayer.validation"

export const PrayerController = {
  async getPrayer(req: Request, res: Response, next: NextFunction) {
    try {
      const query = prayerQuerySchema.parse(
        req.query as Record<string, unknown>
      )

      const data = await PrayerService.getPrayer(query.date, query.city)

      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "Prayer schedule not found"
        })
      }

      res.json({
        status: "success",
        data
      })
    } catch (err) {
      next(err)
    }
  },

  async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = prayerConfigSchema.parse(req.body)
      const config = await PrayerService.updateConfig(payload)

      res.json({
        status: "success",
        data: config
      })
    } catch (err) {
      next(err)
    }
  }
}
