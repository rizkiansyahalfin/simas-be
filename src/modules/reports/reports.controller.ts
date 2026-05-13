import { Request, Response } from "express"
import { ReportsService } from "./reports.service"
import { monthlyFinanceQuerySchema } from "./reports.validation"

export const ReportsController = {
  async monthlyFinance(req: Request, res: Response) {
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
  }
}