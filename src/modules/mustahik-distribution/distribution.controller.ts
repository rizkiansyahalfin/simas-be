import { Request, Response, NextFunction } from "express"
import { DistributionService } from "./distribution.service"
import {
  createDistributionSchema,
  distributionQuerySchema
} from "./distribution.validation"

export const DistributionController = {
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const query = distributionQuerySchema.parse(req.query)

      const result = await DistributionService.getHistory(query)

      res.json({
        status: "success",
        data: result
      })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createDistributionSchema.parse(req.body)

      const result = await DistributionService.create(validated)

      res.status(201).json({
        status: "success",
        data: result
      })
    } catch (err) {
      next(err)
    }
  }
}