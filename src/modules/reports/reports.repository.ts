import prisma from "../../database"

import type { CongregationReportPayload } from "./reports.type"

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

  async getMonthlyZisTransactions({ month, year }: { month: number; year: number }) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    return prisma.zisTransaction.findMany({
      where: {
        deletedAt: null,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        transactionDate: 'asc',
      },
    })
  },

  async getMonthlyZisTotalDistributions({ month, year }: { month: number; year: number }) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const result = await prisma.mustahikDistribution.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        distributionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    return Number(result._sum.amount ?? 0)
  },

  async getMonthlyZisCategoryDistributions({ month, year }: { month: number; year: number }) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const distributions = await prisma.mustahikDistribution.findMany({
      where: {
        distributionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        mustahik: {
          select: {
            category: true,
          },
        },
      },
    })

    const grouped = distributions.reduce<Record<string, number>>((acc: Record<string, number>, distribution: { mustahik: { category: string }; amount: unknown }) => {
      const category = distribution.mustahik.category
      acc[category] = (acc[category] ?? 0) + Number(distribution.amount)
      return acc
    }, {})

    return Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount,
    }))
  },

  async getMonthlyZisCategoryReceipts(
  {
    month,
    year
  }: {
    month: number
    year: number
  }
) {

  const startDate =
    new Date(year, month - 1, 1)

  const endDate =
    new Date(year, month, 0)

  const transactions =
    await prisma.zisTransaction.findMany({

      where: {

        deletedAt: null,

        transactionDate: {
          gte: startDate,
          lte: endDate
        }
      },

      select: {
        amount: true,
        zisCategory: true
      }
    })

  const grouped =
    transactions.reduce<
      Record<string, number>
    >(
      (
        acc,
        transaction
      ) => {

        const category =
          transaction.zisCategory

        acc[category] =
          (acc[category] ?? 0) +
          Number(transaction.amount)

        return acc
      },
      {}
    )

  return Object.entries(grouped)
    .map(
      ([
        category,
        amount
      ]) => ({
        category,
        amount
      })
    )
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
  },

  async getInventoryFullReport() {

  return prisma.inventory.findMany({

    include: {

      category: {
        select: {
          name: true
        }
      },

      manager: {
        select: {
          username: true
        }
      },

      inventoryLoans: {

        select: {

          borrowerName: true,

          loanDate: true,

          expectedReturnDate: true,

          actualReturnDate: true,

          status: true
        },

        orderBy: {
          loanDate: "desc"
        }
      }
    },

    orderBy: {
      itemName: "asc"
    }
  })
},

  async getDonationsReport({
  dateFrom,
  dateTo
}: {
  dateFrom: Date
  dateTo: Date
}) {

  return prisma.donation.findMany({
    where: {
      createdAt: {
        gte: dateFrom,
        lte: dateTo
      }
    },
    include: {
      category: {
        select: {
          name: true
        }
      },
      campaign: {
        select: {
          title: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
},
  async getCongregationReport():
  Promise<CongregationReportPayload> {

    const [
      congregations,
      mustahikStats,
      totalSessions,
      totalAttendanceRecords
    ] = await Promise.all([

      prisma.congregation.findMany({

        where: {
          deletedAt: null
        },

        include: {

          mustahik: true,

          attendanceRecords: {

            include: {
              session: true
            },

            orderBy: {
              checkInAt: "desc"
            }
          }
        },

        orderBy: {
          fullName: "asc"
        }
      }),

      prisma.mustahik.groupBy({

        by: ["category"],

        _count: {
          category: true
        }
      }),

      prisma.attendanceSession.count(),

      prisma.attendanceRecord.count()
    ])

    return {
      congregations,
      mustahikStats,
      totalSessions,
      totalAttendanceRecords
    }
  }
}