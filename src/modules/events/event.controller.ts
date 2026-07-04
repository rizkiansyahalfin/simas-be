import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { EventService } from "./event.service"
import type { EventQueryParams } from "./event.type"
import {
  createEventSchema,
  updateEventSchema,
  updateStatusSchema
} from "./event.validation"

export const EventController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
      const status = req.query.status as string | undefined
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      const search = 
        typeof req.query.search === "string"
        ? req.query.search
        : ""

      const params: EventQueryParams = {
        status,
        page,
        limit,
        search
      }

      const result = await EventService.getAll(params)

      res.json({
        status: "success",
        data: result
      })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
      const validated = createEventSchema.parse(req.body)

      if (!req.user?.id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized"
        })
      }

      const result =
  await EventService.create( validated, req.user.id, req.file?.filename )

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
          message: "Invalid event ID"
        })
      }

      const validated = updateEventSchema.parse(req.body)

      const result = await EventService.update(id, validated, req.file?.filename)

      res.json({
        status: "success",
        data: result
      })
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid event ID"
        })
      }

      const { status } = updateStatusSchema.parse(req.body)

      const result = await EventService.updateStatus(id, status)

      res.json({
        status: "success",
        data: result
      })
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid event ID"
        })
      }

      await EventService.delete(id)

      res.json({
        status: "success",
        message: "Event deleted successfully"
      })
  })
}