import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { DistributionService } from "./distribution.service"
import {
  createDistributionSchema,
  distributionQuerySchema
} from "./distribution.validation"

export const DistributionController = {
  getHistory: asyncHandler(async (req: Request, res: Response) => {
    const query = distributionQuerySchema.parse(req.query)

    const result = await DistributionService.getHistory(query)

    res.json({
      status: "success",
      data: result
    })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validated = createDistributionSchema.parse(req.body)

    const result = await DistributionService.create(validated)

    res.status(201).json({
      status: "success",
      data: result
    })
  })
}