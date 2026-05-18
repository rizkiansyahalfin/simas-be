import type {  Gender } from "../../generated/enums"
import prisma from "../../database"
import { Prisma } from "../../generated/client"

type CongregationFindAllParams = {
  search?: string
  gender?: Gender
  isMustahik?: boolean
  skip: number
  limit: number
}

export const CongregationRepository = {
  async findAll({
    search,
    gender,
    isMustahik,
    skip,
    limit
  }: CongregationFindAllParams) {
    const whereClause: Prisma.CongregationWhereInput = {
      deletedAt: null
    }

    if (search) {
      whereClause.OR = [
        {
          fullName: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          nik: {
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
    }

    if (gender) {
      whereClause.gender = gender
    }

    if (typeof isMustahik === "boolean") {
      whereClause.isMustahik = isMustahik
    }

    const [data, total] = await Promise.all([
      prisma.congregation.findMany({
        where: whereClause,
        include: { mustahik: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.congregation.count({
        where: whereClause
      })
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

  async findById(id: number) {
    return prisma.congregation.findFirst({
      where: {
        id,
        deletedAt: null
      }
    })
  },

  async create(data: Prisma.CongregationCreateInput) {
    return prisma.congregation.create({
      data
    })
  },

  async update(id: number, data: Prisma.CongregationUpdateInput) {
    return prisma.congregation.update({
      where: { id },
      data
    })
  },

  async softDelete(id: number) {
    return prisma.congregation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false
      }
    })
  }
}