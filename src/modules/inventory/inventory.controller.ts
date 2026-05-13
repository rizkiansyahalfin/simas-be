import type { Request, Response } from 'express'
import { InventoryService } from './inventory.service'
import {
  CreateInventorySchema,
  UpdateInventorySchema,
  FilterInventorySchema,
} from './inventory.validation'

export const InventoryController = {
  async findAll(req: Request, res: Response) {
    const filter = FilterInventorySchema.parse({
      condition: req.query.condition,
      category: req.query.category,
      search: req.query.search,
    })
    const data = await InventoryService.findAll(filter)
    return res.status(200).json({ success: true, data })
  },

  async findById(req: Request, res: Response) {
    const data = await InventoryService.findById(Number(req.params.id))
    return res.status(200).json({ success: true, data })
  },

  async create(req: Request, res: Response) {
    const parsed = CreateInventorySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      })
    }
    const data = await InventoryService.create(parsed.data)
    return res.status(201).json({ success: true, data })
  },

  async update(req: Request, res: Response) {
    const parsed = UpdateInventorySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      })
    }
    const data = await InventoryService.update(Number(req.params.id), parsed.data)
    return res.status(200).json({ success: true, data })
  },

  async delete(req: Request, res: Response) {
    await InventoryService.delete(Number(req.params.id))
    return res.status(200).json({ success: true, message: 'Item berhasil dihapus' })
  },
}