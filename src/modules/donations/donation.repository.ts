import prisma from '../../database'
import { DonationStatus } from '../../generated/enums'
import type { CreateDonationInput, UpdateDonationInput } from './donation.type'

export const DonationRepository = {
  async create(data: CreateDonationInput) {
    return prisma.donation.create({ data })
  },

  async findAll({
    status,
    skip,
    limit,
  }: {
    status?: string
    skip: number
    limit: number
  }) {
    const whereClause: { status?: DonationStatus } = status
      ? { status: status as DonationStatus }
      : {}

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