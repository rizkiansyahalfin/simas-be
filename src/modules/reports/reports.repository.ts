import prisma from "../../database"

export const ReportsRepository = {

  async getMonthlyFinance({
    month,
    year
  }: {
    month: number
    year: number
  }) {

    const startDate =
      new Date(year, month - 1, 1)

    const endDate =
      new Date(year, month, 0)

    const cashTransactions =
      await prisma.cashTransaction.findMany({

        where: {

          deletedAt: null,

          transactionDate: {
            gte: startDate,
            lte: endDate
          }
        },

        orderBy: {
          transactionDate: "asc"
        }
      })

    const zisTransactions =
      await prisma.zisTransaction.findMany({

        where: {

          deletedAt: null,

          transactionDate: {
            gte: startDate,
            lte: endDate
          }
        }
      })

    return {
      cashTransactions,
      zisTransactions
    }
  }
}