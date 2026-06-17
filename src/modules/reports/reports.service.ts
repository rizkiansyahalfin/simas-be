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
},
async generateAnnualReport(
  year: number
) {

  const data =
    await ReportsRepository
      .getAnnualReportData(
        year
      )

  const financeIncome =
    data.cashTransactions
      .filter(
        t =>
          t.type === "income"
      )
      .reduce(
        (sum, t) =>
          sum +
          Number(t.amount),
        0
      )

  const financeExpense =
    data.cashTransactions
      .filter(
        t =>
          t.type === "expense"
      )
      .reduce(
        (sum, t) =>
          sum +
          Number(t.amount),
        0
      )

  const zisReceipts =
    data.zisTransactions
      .reduce(
        (sum, t) =>
          sum +
          Number(t.amount),
        0
      )

  const zisDistributions =
    data.distributions
      .reduce(
        (sum, d) =>
          sum +
          Number(d.amount),
        0
      )

  const verifiedAmount =
    data.donations
      .filter(
        d =>
          d.status ===
          "verified"
      )
      .reduce(
        (sum, d) =>
          sum +
          Number(d.amount),
        0
      )

  const pendingAmount =
    data.donations
      .filter(
        d =>
          d.status ===
          "pending"
      )
      .reduce(
        (sum, d) =>
          sum +
          Number(d.amount),
        0
      )

  const totalDonations =
    data.donations.reduce(
      (sum, d) =>
        sum +
        Number(d.amount),
      0
    )

  return {

    year,

    finance: {

      income:
        financeIncome,

      expense:
        financeExpense,

      balance:
        financeIncome -
        financeExpense,

      transactionCount:
        data.cashTransactions
          .length
    },

    zis: {

      receipts:
        zisReceipts,

      distributions:
        zisDistributions,

      balance:
        zisReceipts -
        zisDistributions,

      transactionCount:
        data.zisTransactions
          .length
    },

    donations: {

      totalAmount:
        totalDonations,

      verifiedAmount,

      pendingAmount,

      totalDonations:
        data.donations
          .length
    },

    campaigns: {

      total:
        data.campaigns.length,

      active:
        data.campaigns.filter(
          c =>
            c.status ===
            "active"
        ).length,

      completed:
        data.campaigns.filter(
          c =>
            c.status ===
            "completed"
        ).length,

      cancelled:
        data.campaigns.filter(
          c =>
            c.status ===
            "cancelled"
        ).length,

      totalRaised:
        data.payments.reduce(
          (sum, p) =>
            sum +
            Number(
              p.amount
            ),
          0
        )
    },

    events: {

      total:
        data.events.length,

      upcoming:
        data.events.filter(
          e =>
            e.status ===
            "upcoming"
        ).length,

      ongoing:
        data.events.filter(
          e =>
            e.status ===
            "ongoing"
        ).length,

      completed:
        data.events.filter(
          e =>
            e.status ===
            "completed"
        ).length,

      cancelled:
        data.events.filter(
          e =>
            e.status ===
            "cancelled"
        ).length
    },

    attendance: {

      totalSessions:
        data.sessions.length,

      totalRecords:
        data.attendanceRecords
          .length,

      averageAttendancePerSession:
        data.sessions.length === 0
          ? 0
          : Number(
              (
                data
                  .attendanceRecords
                  .length /
                data
                  .sessions
                  .length
              ).toFixed(2)
            )
    },

    congregations: {

      total:
        data.congregations
          .length,

      active:
        data.congregations
          .filter(
            c =>
              c.isActive
          ).length,

      mustahik:
        data.congregations
          .filter(
            c =>
              c.isMustahik
          ).length
    },

    mustahik: {

      total:
        data.mustahiks.length,

      active:
        data.mustahiks
          .filter(
            m =>
              m.isActive
          ).length,

      totalDistributed:
        zisDistributions,

      byCategory:
        data.mustahikCategories
          .map(
            item => ({
              category:
                item.category,

              count:
                item._count
                  .category
            })
          )
    }
  }
}
}
