import prisma from '../../database'
import { Prisma } from '../../generated/client'
import { DonationStatus } from '../../generated/enums'
import type { CreateDonationInput, UpdateDonationInput } from './donation.type'

export const DonationRepository = {
  async create(data: CreateDonationInput) {
    return prisma.donation.create({ data })
  },

  async findAll({
    status,
    categoryId,
    search,
    skip,
    limit,
  }: {
    status?: string
    categoryId?: number
    search?: string
    skip: number
    limit: number
  }) {
   const whereClause: Prisma.DonationWhereInput = {
  ...(status && {
    status: status as DonationStatus
  }),

  ...(categoryId && {
    categoryId
  }),

  ...(search && {
    OR: [
      {
        donorName: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        phone: {
          contains: search,
          mode: "insensitive"
        }
      }
    ]
  })
}


    const [data, total] = await Promise.all([
      prisma.donation.findMany({
        where: whereClause,
        include: {
          verifier: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.donation.count({
        where: whereClause,
      }),
    ])

    return {
      data,
      meta: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  async getPublicStats() {

  const now = new Date()

  const startOfMonth =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )

  const [
    totalDonors,
    totalCollected,
    monthlyCollected
  ] = await Promise.all([

    prisma.donation.count({
      where: {
        status: "verified"
      }
    }),

    prisma.donation.aggregate({
      where: {
        status: "verified"
      },

      _sum: {
        amount: true
      }
    }),

    prisma.donation.aggregate({
      where: {
        status: "verified",

        createdAt: {
          gte: startOfMonth
        }
      },

      _sum: {
        amount: true
      }
    })
  ])

  return {
    totalDonors,

    totalCollected:
      totalCollected._sum.amount
        ?.toNumber() ?? 0,

    monthlyCollected:
      monthlyCollected._sum.amount
        ?.toNumber() ?? 0,
  }
},

  async findById(id: number) {
    return prisma.donation.findUnique({
      where: { id },
      include: {
        verifier: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    })
  },

  async update(id: number, data: UpdateDonationInput) {
    return prisma.donation.update({
      where: { id },
      data,
      include: {
        verifier: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    })
  },
}