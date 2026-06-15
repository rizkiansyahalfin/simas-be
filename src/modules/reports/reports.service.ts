import { ReportsRepository } from "./reports.repository"
import { generateFinancePdf } from "./exporters/reports.pdf"
import { generateFinanceExcel, generateInventoryExcel } from "./exporters/reports.excel"
import { generateZisMonthlyPdf } from "./generators/reports.zis.pdf"
import { generateInventoryPdf } from "./generators/reports.inventory.pdf"
import { generateDonationsExcel } from "./exporters/reports.excel"
import { generateCongregationExcel } from "./generators/reports.congregation.excel"
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
},
async generateInventoryPdf() {

  const inventories =
    await ReportsRepository
      .getInventoryFullReport()

  const payload = {

    totalAssets:
      inventories.length,

    totalQuantity:
      inventories.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      ),

    conditionSummary: {

      baik:
        inventories.filter(
          i =>
            i.condition === "baik"
        ).length,

      rusak_ringan:
        inventories.filter(
          i =>
            i.condition ===
            "rusak_ringan"
        ).length,

      rusak_berat:
        inventories.filter(
          i =>
            i.condition ===
            "rusak_berat"
        ).length,

      hilang:
        inventories.filter(
          i =>
            i.condition ===
            "hilang"
        ).length
    },

    inventories
  }

  return generateInventoryPdf(
    payload
  )
},
async generateCongregationExcel() {

  const report =
    await ReportsRepository
      .getCongregationReport()

  return generateCongregationExcel(
    report
  )
}
}
