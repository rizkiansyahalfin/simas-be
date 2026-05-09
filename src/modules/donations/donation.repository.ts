import prisma from '../../database'
import type { CreateDonationInput } from './donation.validation'

export const DonationRepository = {
  async create(data: CreateDonationInput) {
    return prisma.donation.create({
      data: {
        donorName: data.donorName,
        phone: data.phone,
        amount: data.amount,
        category: data.category,
        proofImageUrl: data.proofImageUrl,
      },
    })
  },

  async findById(id: number) {
    return prisma.donation.findUnique({ where: { id } })
  },

  async findAll() {
    return prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async verify(
    id: number,
    verifiedBy: number,
    status: 'verified' | 'rejected',
    rejectionNote?: string
  ) {
    return prisma.donation.update({
      where: { id },
      data: {
        status,
        verifiedBy,
        verifiedAt: new Date(),
        rejectionNote: rejectionNote ?? null,
      },
    })
  },
}