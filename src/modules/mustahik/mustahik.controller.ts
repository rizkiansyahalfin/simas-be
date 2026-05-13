import { Request, Response, NextFunction } from "express"
import { MustahikService } from "./mustahik.service"
import {
  createMustahikSchema,
  updateMustahikSchema,
  mustahikQuerySchema
} from "./mustahik.validation"

export const MustahikController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = mustahikQuerySchema.parse(req.query)

      const result = await MustahikService.getAll(query)

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
      const validated = createMustahikSchema.parse(req.body)

      const result = await MustahikService.create(validated)

      res.status(201).json({
        status: "success",
        data: result
      })
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (err) {
      next(err)
    }
  }
}