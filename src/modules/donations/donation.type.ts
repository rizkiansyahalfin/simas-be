import { Donation, Prisma } from "../../generated/client"


export type CreateDonationInput = {
  donorName: string
  phone?: string
  amount: number
  categoryId: number
  proofImageUrl?: string
  status?: 'pending' | 'verified' | 'rejected'
}

export type UpdateDonationInput = {
  status?: 'pending' | 'verified' | 'rejected'
  verifiedBy?: number
  verifiedAt?: Date
  rejectionNote?: string
}

export type DonationResponse = Omit<Donation, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  verifier?: {
    id: number
    username: string
    role: string
  }
}

export type GetDonationsQuery = {
  status?: 'pending' | 'verified' | 'rejected'
  categoryId?: number
  search?: string
  page: number
  limit: number
}

export type DonationWithCategory =
  Prisma.DonationGetPayload<{
    include: {
      category: {
        select: {
          name: true
        }
      }
    }
  }>
