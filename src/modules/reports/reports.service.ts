import { ReportsRepository } from "./reports.repository"
import { generateFinancePdf } from "./exporters/reports.pdf"
import { generateFinanceExcel, generateInventoryExcel } from "./exporters/reports.excel"
import { generateZisMonthlyPdf } from "./generators/reports.zis.pdf"
import { generateInventoryPdf } from "./generators/reports.inventory.pdf"
import { generateDonationsExcel } from "./exporters/reports.excel"
import { generateCongregationExcel } from "./generators/reports.congregation.excel"
import redis from "../../lib/redis"
import type {
  MonthlyFinanceQuery,
  MonthlyZisQuery,
  WeeklyFinanceQuery,
  FinancePdfPayload,
  InventoryReport,
  ZisReportPdfPayload,
} from "./reports.type"

const ANNUAL_REPORT_TTL = 300 // 5 minutes cache

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
  const cacheKey = `annual-report:${year}`

  // Try Redis cache first
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const data =
    await ReportsRepository
      .getAnnualReportData(
        year
      )

  // Helper to extract campaign/event counts from groupBy results
  const getCampaignCount = (status: string) => {
    const found = data.campaigns.find(c => c.status === status)
    return found?._count?.id ?? 0
  }

  const getEventCount = (status: string) => {
    const found = data.events.find(e => e.status === status)
    return found?._count?.id ?? 0
  }

  const totalDonations =
    data.donationsVerifiedAmount +
    data.donationsPendingAmount

  const result = {

    year,

    finance: {

      income:
        data.financeIncome,

      expense:
        data.financeExpense,

      balance:
        data.financeIncome -
        data.financeExpense,

      transactionCount:
        data.financeTransactionCount
    },

    zis: {

      receipts:
        data.zisReceipts,

      distributions:
        data.zisDistributions,

      balance:
        data.zisReceipts -
        data.zisDistributions,

      transactionCount:
        data.zisTransactionCount
    },

    donations: {

      totalAmount:
        totalDonations,

      verifiedAmount:
        data.donationsVerifiedAmount,

      pendingAmount:
        data.donationsPendingAmount,

      totalDonations:
        data.donationsTotalCount
    },

    campaigns: {

      total:
        getCampaignCount("active") +
        getCampaignCount("completed") +
        getCampaignCount("cancelled"),

      active:
        getCampaignCount("active"),

      completed:
        getCampaignCount("completed"),

      cancelled:
        getCampaignCount("cancelled"),

      totalRaised:
        data.totalRaised
    },

    events: {

      total:
        getEventCount("upcoming") +
        getEventCount("ongoing") +
        getEventCount("completed") +
        getEventCount("cancelled"),

      upcoming:
        getEventCount("upcoming"),

      ongoing:
        getEventCount("ongoing"),

      completed:
        getEventCount("completed"),

      cancelled:
        getEventCount("cancelled")
    },

    attendance: {

      totalSessions:
        data.sessionCount,

      totalRecords:
        data.attendanceRecordCount,

      averageAttendancePerSession:
        data.sessionCount === 0
          ? 0
          : Number(
              (
                data
                  .attendanceRecordCount /
                data
                  .sessionCount
              ).toFixed(2)
            )
    },

    congregations: {

      total:
        data.congregationCount,

      active:
        data.activeCongregationCount,

      mustahik:
        data.mustahikCongregationCount
    },

    mustahik: {

      total:
        data.mustahikCount,

      active:
        data.activeMustahikCount,

      totalDistributed:
        data.zisDistributions,

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

  // Cache for 5 minutes
  await redis.setex(cacheKey, ANNUAL_REPORT_TTL, JSON.stringify(result))

  return result
}
}
