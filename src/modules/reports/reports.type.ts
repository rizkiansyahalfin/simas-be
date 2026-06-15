import type {
  CashTransaction,
  Inventory,
  ZisTransaction,
  Campaign,
  Donation,
  DonationCategory,
  InventoryCondition,
  LoanStatus
} from "../../generated/client"

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
