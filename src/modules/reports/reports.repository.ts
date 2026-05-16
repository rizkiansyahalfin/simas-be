import prisma from "../../database"

export const ReportsRepository = {
  async getWeeklyFinance({
  startDate,
  endDate
}: {
  startDate: Date
  endDate: Date
}) {

  return prisma.cashTransaction.findMany({

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
},
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
  },
   async getInventoryReport() {

    return prisma.inventory.findMany({

      include: {

        manager: {
          select: {
            username: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    })
  }
}