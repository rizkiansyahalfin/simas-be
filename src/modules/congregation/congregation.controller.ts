import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import {
  congregationQuerySchema,
  createCongregationSchema,
  updateCongregationSchema
} from "./congregation.validation"
import { CongregationService } from "./congregation.service"

export const CongregationController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
      const query = congregationQuerySchema.parse(req.query)
      const result = await CongregationService.getAll(query)

      res.json({
        status: "success",
        data: result
      })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
      const validated = createCongregationSchema.parse(req.body)
      const result = await CongregationService.create(validated)

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
          message: "Invalid congregation ID"
        })
      }

      const validated = updateCongregationSchema.parse(req.body)
      const result = await CongregationService.update(id, validated)

      res.json({
        status: "success",
        data: result
      })
  }),

  export: asyncHandler(async (req: Request, res: Response) => {
    const format = req.query.format

    if (format !== "excel") {
      return res.status(400).json({
        status: "error",
        message: "Format must be excel"
      })
    }

    const file =
      await CongregationService.exportExcel()

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=congregations.xlsx"
    )

    return res.send(file)
  }),

  import: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "File required"
      })
    }

    const result =
      await CongregationService.importFile(
        req.file.path
      )

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
          message: "Invalid congregation ID"
        })
      }

      await CongregationService.delete(id)

      res.json({
        status: "success",
        message: "Congregation deleted successfully"
      })
    }
  ),

  getQrCode: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid congregation ID"
      })
    }

    const result =
      await CongregationService.generateQrCode(id)

    res.json({
      status: "success",
      data: result
    })
  })
}