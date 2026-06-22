import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { InventoryService } from './inventory.service'
import {
  CreateInventorySchema,
  UpdateInventorySchema,
  FilterInventorySchema
} from './inventory.validation'

export const InventoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
      const filter = FilterInventorySchema.parse(req.query)
      const data = await InventoryService.getAll(filter)

      res.json({
        status: 'success',
        data
      })
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid inventory ID'
        })
      }

      const data = await InventoryService.getById(id)

      res.json({
        status: 'success',
        data
      })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
      const validated =
        CreateInventorySchema.parse(
          req.body
        )
      
      const data =
        await InventoryService.create(
          validated,
          req.file
        )

      res.status(201).json({
        status: 'success',
        data
      })
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid inventory ID'
        })
      }

      const validated =
        UpdateInventorySchema.parse(
          req.body
        )
      
      const data =
        await InventoryService.update(
          id,
          validated,
          req.file
        )
        
      res.json({
        status: 'success',
        data
      })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid inventory ID'
        })
      }

      await InventoryService.delete(id)

      res.json({
        status: 'success',
        message: 'Inventory item deleted successfully'
      })
  })
}