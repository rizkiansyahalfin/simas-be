import type { Prisma } from "../../generated/client"
import type { LoanRepositoryParams } from "./inventory-loan.type"
import prisma from "../../database"

export const InventoryLoanRepository = {
  async findAll({ status, borrowerName, skip, limit }: LoanRepositoryParams) {
    const whereClause: Prisma.InventoryLoanWhereInput = {}

    if (status) {
      whereClause.status = status
    }

    if (borrowerName) {
      whereClause.borrowerName = {
        contains: borrowerName,
        mode: "insensitive"
      }
    }

    const [data, total] = await Promise.all([
      prisma.inventoryLoan.findMany({
        where: whereClause,
        include: { inventory: true, creator: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.inventoryLoan.count({ where: whereClause })
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
    return prisma.inventoryLoan.findUnique({
      where: { id },
      include: { inventory: true, creator: true }
    })
  },

  async create(data: Prisma.InventoryLoanCreateInput) {
    return prisma.inventoryLoan.create({
      data,
      include: { inventory: true, creator: true }
    })
  },

  async update(id: number, data: Prisma.InventoryLoanUpdateInput) {
    return prisma.inventoryLoan.update({
      where: { id },
      data,
      include: { inventory: true, creator: true }
    })
  },

  async delete(id: number) {
    return prisma.inventoryLoan.delete({
      where: { id }
    })
  },

  async returnLoan(id: number, data: Prisma.InventoryLoanUpdateInput) {
    return prisma.inventoryLoan.update({
      where: { id },
      data,
      include: { inventory: true, creator: true }
    })
  }
}