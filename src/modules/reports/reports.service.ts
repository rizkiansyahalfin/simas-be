import { ReportsRepository } from "./reports.repository"
import { generateFinancePdf } from "./reports.pdf"
import type { MonthlyFinanceQuery, FinancePdfPayload } from "./reports.type"

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
  }
}