import prisma from "../../database"
import { MustahikCategory } from "../../generated/enums"
import type {
  Mustahik,
  CreateMustahikData,
  UpdateMustahikData,
  MustahikRepositoryParams,
  PaginatedMustahiks
} from "./mustahik.type"

export const MustahikRepository = {
  async findAll({
    category,
    skip,
    limit
  }: MustahikRepositoryParams): Promise<PaginatedMustahiks> {
    const whereClause = category ? { category: category as MustahikCategory } : {}

    const [data, total] = await Promise.all([
      prisma.mustahik.findMany({
        where: whereClause,
        include: {
          congregation: true
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.mustahik.count({
        where: whereClause
      })
    ])

    return {
      data: data as unknown as Mustahik[],
      meta: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  async findById(id: number): Promise<Mustahik | null> {
    return prisma.mustahik.findUnique({
      where: { id },
      include: {
        congregation: true
      }
    }) as unknown as Promise<Mustahik | null>
  },

  async create(data: CreateMustahikData): Promise<Mustahik> {
    return prisma.mustahik.create({
      data,
      include: {
        congregation: true
      }
    }) as unknown as Promise<Mustahik>
  },

  async update(id: number, data: UpdateMustahikData): Promise<Mustahik> {
    return prisma.mustahik.update({
      where: { id },
      data,
      include: {
        congregation: true
      }
    }) as unknown as Promise<Mustahik>
  }
}