import { ReportsRepository } from "./reports.repository"
import { generateFinancePdf } from "./reports.pdf"
import { generateFinanceExcel, generateInventoryExcel } from "./reports.excel"
import { generateZisMonthlyPdf } from "./reports.zis.pdf"
import { generateDonationsExcel } from "./reports.excel"
import type {
  MonthlyFinanceQuery,
  MonthlyZisQuery,
  WeeklyFinanceQuery,
  FinancePdfPayload,
  InventoryReport,
  ZisReportPdfPayload,
} from "./reports.type"

export const ReportsService = {
  async generateMonthlyFinancePdf({ month, year }: MonthlyFinanceQuery) {
    const data = await ReportsRepository.getMonthlyFinance({ month, year })

    const totalIncome = data.cashTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, item) => acc + Number(item.amount), 0)

    const totalExpense = data.cashTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, item) => acc + Number(item.amount), 0)

    const balance = totalIncome - totalExpense

    const payload: FinancePdfPayload = {
      month,
      year,
      totalIncome,
      totalExpense,
      balance,
      cashTransactions: data.cashTransactions,
      zisTransactions: data.zisTransactions
    }

    return generateFinancePdf(payload)
  },

  async generateWeeklyFinanceExcel({ startDate, endDate }: WeeklyFinanceQuery) {
    const transactions = await ReportsRepository.getWeeklyFinance({ startDate, endDate })
    return generateFinanceExcel(transactions)
  },

  async generateInventoryExcel() {
    const inventories = await ReportsRepository.getInventoryReport()
    return generateInventoryExcel(inventories as InventoryReport[])
  },

  async generateMonthlyZisPdf({ month, year }: MonthlyZisQuery) {
    const [zisTransactions, totalDistributions, categoryDistributions, categoryReceipts] = await Promise.all([
  ReportsRepository.getMonthlyZisTransactions({month,year}),
  ReportsRepository.getMonthlyZisTotalDistributions({month,year}),
  ReportsRepository.getMonthlyZisCategoryDistributions({month,year}),
  ReportsRepository.getMonthlyZisCategoryReceipts({month,year})
])

    const totalReceipts = zisTransactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0
    )

  const payload:
    ZisReportPdfPayload = {
      month,
      year,
      totalReceipts,
      totalDistributions,
      zisTransactions,
      categoryReceipts,
      categoryDistributions
    }

    return generateZisMonthlyPdf(payload)
  },
  async generateDonationsExcel({
  dateFrom,
  dateTo
}: {
  dateFrom: Date
  dateTo: Date
}) {

  const donations =
    await ReportsRepository
      .getDonationsReport({
        dateFrom,
        dateTo
      })

  return generateDonationsExcel(
    donations
  )
}
}
