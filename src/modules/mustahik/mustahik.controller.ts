import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { MustahikService } from "./mustahik.service"
import {
  createMustahikSchema,
  updateMustahikSchema,
  mustahikQuerySchema
} from "./mustahik.validation"

export const MustahikController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
      const query = mustahikQuerySchema.parse(req.query)

      const result = await MustahikService.getAll(query)

      res.json({
        status: "success",
        data: result
      })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
      const validated = createMustahikSchema.parse(req.body)

      const result = await MustahikService.create(validated)

      res.status(201).json({
        status: "success",
        data: result
      })
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid mustahik ID"
        })
      }

      const validated = updateMustahikSchema.parse(req.body)

      const result = await MustahikService.update(id, validated)

      res.json({
        status: "success",
        data: result
      })
  })
}