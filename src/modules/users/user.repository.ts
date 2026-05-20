import type { Prisma } from "../../generated/client"
import { Role } from "../../generated/enums"
import prisma from "../../database"

type UserFilters = {
  search?: string
  role?: Role
  isActive?: boolean
}

const buildWhere = (filters: UserFilters = {}) => {
  const where: Prisma.UserWhereInput = {}

  if (filters.role) {
    where.role = filters.role
  }

  if (typeof filters.isActive === "boolean") {
    where.isActive = filters.isActive
  }

  if (filters.search) {
    where.OR = [
      { username: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } }
    ]
  }

  return where
}

export const UserRepository = {
  async findAll(skip: number, take: number, filters: UserFilters = {}) {
    return prisma.user.findMany({
      where: buildWhere(filters),
      skip,
      take,
      orderBy: { createdAt: "desc" }
    })
  },

  async count(filters: UserFilters = {}) {
    return prisma.user.count({
      where: buildWhere(filters)
    })
  },

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id }
    })
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  },

  async update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data
    })
  },

  async updateStatus(id: number, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive }
    })
  }
}