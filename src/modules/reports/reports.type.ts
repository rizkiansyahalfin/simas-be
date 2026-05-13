import type { CashTransaction, ZisTransaction } from "../../generated/client"

export type MonthlyFinanceQuery = {
  month: number
  year: number
}

export type FinancePdfPayload = MonthlyFinanceQuery & {
  totalIncome: number
  totalExpense: number
  balance: number
  cashTransactions: CashTransaction[]
  zisTransactions: ZisTransaction[]
}
