import prisma from "../../database"
import type {
  MustahikDistribution,
  CreateDistributionData,
  DistributionRepositoryParams,
  PaginatedDistributions
} from "./distribution.type"

export const DistributionRepository = {
  async findAll({
    skip,
    limit
  }: DistributionRepositoryParams): Promise<PaginatedDistributions> {
    const [data, total] = await Promise.all([
      prisma.mustahikDistribution.findMany({
        include: {
          mustahik: {
            include: {
              congregation: true
            }
          },
          zisTransaction: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.mustahikDistribution.count()
    ])

    return {
      data,
      meta: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  async create(data: CreateDistributionData): Promise<MustahikDistribution> {
    return prisma.mustahikDistribution.create({
      data: {
        ...data,
        distributionDate: new Date(data.distributionDate)
      },
      include: {
        mustahik: {
          include: {
            congregation: true
          }
        },
        zisTransaction: true
      }
    })
  }
}