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
