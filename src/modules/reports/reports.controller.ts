import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { ReportsService } from "./reports.service"
import {
  monthlyFinanceQuerySchema,
  monthlyZisQuerySchema,
  weeklyFinanceQuerySchema,
  donationsReportQuerySchema,
  inventoryReportQuerySchema,
  annualReportQuerySchema
} from "./reports.validation"

export const ReportsController = {
  monthlyFinance: asyncHandler(async (req: Request, res: Response) => {
    const query = monthlyFinanceQuerySchema.safeParse(req.query)

    if (!query.success) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: query.error.format()
      })
    }

    const { month, year } = query.data
    const pdf = await ReportsService.generateMonthlyFinancePdf({ month, year })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="finance-${month}-${year}.pdf"`
    )

    return res.send(pdf)
  }),

  inventoryExcel: asyncHandler(async (req: Request, res: Response) => {
    const buffer = await ReportsService.generateInventoryExcel()

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-report.xlsx"
    )

    return res.send(buffer)
  }),

  weeklyFinanceExcel: asyncHandler(async (req: Request, res: Response) => {
    const query = weeklyFinanceQuerySchema.safeParse(req.query)

    if (!query.success) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: query.error.format()
      })
    }

    const { startDate, endDate } = query.data
    const buffer = await ReportsService.generateWeeklyFinanceExcel({ startDate, endDate })

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weekly-finance.xlsx"
    )

    return res.send(buffer)
  }),

  monthlyZis: asyncHandler(async (req: Request, res: Response) => {
    const query = monthlyZisQuerySchema.safeParse(req.query)

    if (!query.success) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: query.error.format(),
      })
    }

    const { month, year, format } = query.data

    if (format === 'pdf') {
      const pdf = await ReportsService.generateMonthlyZisPdf({ month, year })

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="zis-${month}-${year}.pdf"`
      )

      return res.send(pdf)
    }

    return res.status(400).json({ message: 'Invalid format, only pdf is supported' })
  }),

  donationsExcel: asyncHandler(async (
  req: Request,
  res: Response
) => {

  const query =
    donationsReportQuerySchema
      .safeParse(
        req.query
      )

  if (!query.success) {

    return res
      .status(400)
      .json({

        message:
          "Invalid query",

        errors:
          query.error.format()
      })
  }

  const {
    date_from,
    date_to
  } = query.data

  const buffer =
    await ReportsService
      .generateDonationsExcel({

        dateFrom:
          date_from,

        dateTo:
          date_to
      })

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=donations-report.xlsx"
  )

  return res.send(buffer)
}),

inventoryFull: asyncHandler(async (
  req: Request,
  res: Response
) => {

  const query =
    inventoryReportQuerySchema
      .safeParse(req.query)

  if (!query.success) {

    return res
      .status(400)
      .json({
        message:
          "Invalid query"
      })
  }

  const pdf =
    await ReportsService
      .generateInventoryPdf()

  res.setHeader(
    "Content-Type",
    "application/pdf"
  )

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="inventory-full-report.pdf"'
  )

  return res.send(pdf)
}),

congregations: asyncHandler(async (
  req: Request,
  res: Response
) => {

  const buffer =
    await ReportsService
      .generateCongregationExcel()

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=congregations-report.xlsx"
  )

  return res.send(buffer)
}),

 annualReport: asyncHandler(async (
  req: Request,
  res: Response
) => {

  const query =
    annualReportQuerySchema
      .parse(req.query)

  const result =
    await ReportsService
      .generateAnnualReport(
        query.year
      )

  return res.json({
    success: true,
    data: result
  })
})
}