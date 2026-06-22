import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
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
  getAll: asyncHandler(async (_req: Request, res: Response) => {
      const data = await InventoryCategoryService.getAll()

      res.json({
        status: "success",
        data,
      })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
      const payload = createInventoryCategorySchema.parse(req.body)
      const result = await InventoryCategoryService.create(payload)

      res.status(201).json({
        status: "success",
        data: result,
      })
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
      const id = parseId(req.params.id)
      const payload = updateInventoryCategorySchema.parse(req.body)
      const result = await InventoryCategoryService.update(id, payload)

      res.json({
        status: "success",
        data: result,
      })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
      const id = parseId(req.params.id)
      await InventoryCategoryService.delete(id)

      res.json({
        status: "success",
        message: "Category deleted successfully",
      })
  }),
}