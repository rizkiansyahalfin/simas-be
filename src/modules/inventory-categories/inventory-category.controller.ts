import type { Request, Response, NextFunction } from "express"
import { InventoryCategoryService } from "./inventory-category.service"
import {
  createInventoryCategorySchema,
  updateInventoryCategorySchema,
} from "./inventory-category.validation"

const parseId = (value: unknown): number => {
  const id = Number(value)

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("INVALID_CATEGORY_ID")
  }

  return id
}

export const InventoryCategoryController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await InventoryCategoryService.getAll()

      res.json({
        status: "success",
        data,
      })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = createInventoryCategorySchema.parse(req.body)
      const result = await InventoryCategoryService.create(payload)

      res.status(201).json({
        status: "success",
        data: result,
      })
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id)
      const payload = updateInventoryCategorySchema.parse(req.body)
      const result = await InventoryCategoryService.update(id, payload)

      res.json({
        status: "success",
        data: result,
      })
    } catch (err) {
      next(err)
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id)
      await InventoryCategoryService.delete(id)

      res.json({
        status: "success",
        message: "Category deleted successfully",
      })
    } catch (err) {
      next(err)
    }
  },
}
