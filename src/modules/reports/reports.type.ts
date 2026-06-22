import type {
  Prisma,
  CashTransaction,
  Inventory,
  ZisTransaction,
  Campaign,
  Donation,
  DonationCategory,
  InventoryCondition,
  LoanStatus
} from "../../generated/client"

export type CongregationReportData =
  Prisma.CongregationGetPayload<{
    include: {
      mustahik: true
      attendanceRecords: {
        include: {
          session: true
        }
      }
    }
  }>

export type MustahikStatistic = {
  category: string
  _count: {
    category: number
  }
}

export type CongregationReportPayload = {
  congregations: CongregationReportData[]
  mustahikStats: MustahikStatistic[]
  totalSessions: number
  totalAttendanceRecords: number
}

export type DonationReport = Donation & {
  category: Pick<
    DonationCategory,
    "name"
  > | null

  campaign: Pick<
    Campaign,
    "title"
  > | null
}

export type MonthlyFinanceQuery = {
  month: number
  year: number
}

export type WeeklyFinanceQuery = {
  startDate: Date
  endDate: Date
}

export type FinancePdfPayload = MonthlyFinanceQuery & {
  totalIncome: number
  totalExpense: number
  balance: number
  cashTransactions: CashTransaction[]
  zisTransactions: ZisTransaction[]
}

export type InventoryReport = Inventory & {
  manager: {
    username: string | null
  }
}

export type MonthlyZisQuery = {
  month: number
  year: number
}

export type ZisCategoryDistribution = {
  category: string
  amount: number
}

export type ZisReportPdfPayload =
  MonthlyZisQuery & {

    totalReceipts: number

    totalDistributions: number

    zisTransactions: ZisTransaction[]

    categoryReceipts:
      ZisCategoryReceipt[]

    categoryDistributions:
      ZisCategoryDistribution[]
  }

export type ZisCategoryReceipt = {
  category: string
  amount: number
}

export type DonationsReportQuery = {
  dateFrom: Date
  dateTo: Date
}

export type DonationReportRow = {
  id: number
  donorName: string
  phone: string | null
  amount: number
  status: string
  category: string | null
  campaign: string | null
  verifiedAt: Date | null
  createdAt: Date
}

export type InventoryReportPdfItem = {
  id: number
  itemCode: string
  itemName: string

  quantity: number

  condition: InventoryCondition

  category: {
    name: string
  }

  manager: {
    username: string | null
  }

  inventoryLoans: {
    borrowerName: string
    loanDate: Date
    expectedReturnDate: Date
    actualReturnDate: Date | null
    status: LoanStatus
  }[]
}

export type InventoryReportPdfPayload = {
  totalAssets: number
  totalQuantity: number

  conditionSummary: {
    baik: number
    rusak_ringan: number
    rusak_berat: number
    hilang: number
  }

  inventories: InventoryReportPdfItem[]
}

export type AnnualReportQuery = {
  year: number
}

export type AnnualReportResponse = {
  year: number

  finance: {
    income: number
    expense: number
    balance: number
    transactionCount: number
  }

  zis: {
    receipts: number
    distributions: number
    balance: number
    transactionCount: number
  }

  donations: {
    totalAmount: number
    verifiedAmount: number
    pendingAmount: number
    totalDonations: number
  }

  campaigns: {
    total: number
    active: number
    completed: number
    cancelled: number
    totalRaised: number
  }

  events: {
    total: number
    upcoming: number
    ongoing: number
    completed: number
    cancelled: number
  }

  attendance: {
    totalSessions: number
    totalRecords: number
    averageAttendancePerSession: number
  }

  congregations: {
    total: number
    active: number
    mustahik: number
  }

  mustahik: {
    total: number
    active: number
    totalDistributed: number
    byCategory: {
      category: string
      count: number
    }[]
  }
}