export interface MustahikDistribution {
  id: number
  mustahikId: number
  zisTransactionId: number
  amount: number
  description?: string | null
  distributionDate: Date
  createdAt: Date
  mustahik?: {
    id: number
    category: string
    congregation: {
      id: number
      name: string
    }
  }
  zisTransaction?: {
    id: number
    amount: number | string // Prisma Decimal, can be converted to number
    type: string
    description?: string | null
    createdBy: number
    transactionDate: Date
    zisCategory: string
    muzakkiName?: string | null
    deletedAt?: Date | null
  }
}

export interface CreateDistributionData {
  mustahikId: number
  zisTransactionId: number
  amount: number
  description?: string
  distributionDate: string
}

export interface DistributionQueryParams {
  page: number
  limit: number
}

export interface DistributionRepositoryParams {
  skip: number
  limit: number
}

export interface PaginatedDistributions {
  data: MustahikDistribution[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}