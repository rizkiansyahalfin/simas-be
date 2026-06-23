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
  },
  async getAnnualReportData(
  year: number
) {

  const startDate =
    new Date(year, 0, 1)

  const endDate =
    new Date(year, 11, 31)

  // Use 4 parallel aggregate queries instead of 12 full-table scans
  const [
    // Group 1: Finance (cash transactions grouped by type)
    finance,
    // Group 2: ZIS & Distributions
    zis,
    // Group 3: Donations, Campaigns, Payments, Events
    misc,
    // Group 4: Attendance, Congregations, Mustahiks
    people
  ] = await Promise.all([

    // === GROUP 1: FINANCE ===
    (async () => {
      const [incomeAgg, expenseAgg] = await Promise.all([
        prisma.cashTransaction.aggregate({
          _sum: { amount: true },
          _count: { id: true },
          where: { deletedAt: null, type: "income", transactionDate: { gte: startDate, lte: endDate } }
        }),
        prisma.cashTransaction.aggregate({
          _sum: { amount: true },
          _count: { id: true },
          where: { deletedAt: null, type: "expense", transactionDate: { gte: startDate, lte: endDate } }
        })
      ])
      return { incomeAgg, expenseAgg }
    })(),

    // === GROUP 2: ZIS & DISTRIBUTIONS ===
    (async () => {
      const [zisAgg, distributionAgg, categories] = await Promise.all([
        prisma.zisTransaction.aggregate({
          _sum: { amount: true },
          _count: { id: true },
          where: { deletedAt: null, transactionDate: { gte: startDate, lte: endDate } }
        }),
        prisma.mustahikDistribution.aggregate({
          _sum: { amount: true },
          where: { distributionDate: { gte: startDate, lte: endDate } }
        }),
        prisma.mustahik.groupBy({
          by: ["category"],
          _count: { category: true }
        })
      ])
      return { zisAgg, distributionAgg, categories }
    })(),

    // === GROUP 3: DONATIONS, CAMPAIGNS, PAYMENTS, EVENTS ===
    (async () => {
      const [verifiedAgg, pendingAgg, donationCount, campaigns, payments, events] = await Promise.all([
        prisma.donation.aggregate({
          _sum: { amount: true },
          _count: { id: true },
          where: { createdAt: { gte: startDate, lte: endDate }, status: "verified" }
        }),
        prisma.donation.aggregate({
          _sum: { amount: true },
          _count: { id: true },
          where: { createdAt: { gte: startDate, lte: endDate }, status: "pending" }
        }),
        prisma.donation.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        prisma.campaign.groupBy({ by: ["status"], _count: { id: true } }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { transactionStatus: "settlement" }
        }),
        prisma.event.groupBy({
          by: ["status"],
          _count: { id: true },
          where: { createdAt: { gte: startDate, lte: endDate } }
        })
      ])
      return { verifiedAgg, pendingAgg, donationCount, campaigns, payments, events }
    })(),

    // === GROUP 4: ATTENDANCE, CONGREGATIONS, MUSTAHIKS ===
    (async () => {
      const [sessionCount, attendanceCount, congregationCount, activeCongregation, mustahikCongregation, mustahikCount, activeMustahik] = await Promise.all([
        prisma.attendanceSession.count({ where: { sessionDate: { gte: startDate, lte: endDate } } }),
        prisma.attendanceRecord.count({ where: { checkInAt: { gte: startDate, lte: endDate } } }),
        prisma.congregation.count({ where: { deletedAt: null } }),
        prisma.congregation.count({ where: { deletedAt: null, isActive: true } }),
        prisma.congregation.count({ where: { deletedAt: null, isMustahik: true } }),
        prisma.mustahik.count(),
        prisma.mustahik.count({ where: { isActive: true } })
      ])
      return { sessionCount, attendanceCount, congregationCount, activeCongregation, mustahikCongregation, mustahikCount, activeMustahik }
    })()
  ])

  return {
    // Cash finance
    financeIncome: Number(finance.incomeAgg._sum.amount ?? 0),
    financeExpense: Number(finance.expenseAgg._sum.amount ?? 0),
    financeTransactionCount: finance.incomeAgg._count.id + finance.expenseAgg._count.id,

    // ZIS
    zisReceipts: Number(zis.zisAgg._sum.amount ?? 0),
    zisTransactionCount: zis.zisAgg._count.id,

    // Distributions
    zisDistributions: Number(zis.distributionAgg._sum.amount ?? 0),

    // Donations
    donationsVerifiedAmount: Number(misc.verifiedAgg._sum.amount ?? 0),
    donationsPendingAmount: Number(misc.pendingAgg._sum.amount ?? 0),
    donationsVerifiedCount: misc.verifiedAgg._count.id,
    donationsPendingCount: misc.pendingAgg._count.id,
    donationsTotalCount: misc.donationCount,

    // Campaigns
    campaigns: misc.campaigns,

    // Payments
    totalRaised: Number(misc.payments._sum.amount ?? 0),

    // Events
    events: misc.events,

    // Attendance
    sessionCount: people.sessionCount,
    attendanceRecordCount: people.attendanceCount,

    // Congregations
    congregationCount: people.congregationCount,
    activeCongregationCount: people.activeCongregation,
    mustahikCongregationCount: people.mustahikCongregation,

    // Mustahiks
    mustahikCount: people.mustahikCount,
    activeMustahikCount: people.activeMustahik,

    // Categories
    mustahikCategories: zis.categories
  }
}
}