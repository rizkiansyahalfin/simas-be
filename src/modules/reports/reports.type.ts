import type {
  CashTransaction,
  Inventory,
  ZisTransaction
} from "../../generated/client"

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

export type ZisReportPdfPayload = MonthlyZisQuery & {
  totalReceipts: number
  totalDistributions: number
  zisTransactions: ZisTransaction[]
  categoryDistributions: ZisCategoryDistribution[]
}
