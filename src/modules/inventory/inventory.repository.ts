import type { FilterInventoryParams } from './inventory.type'
import type { CreateInventoryInput, UpdateInventoryInput } from './inventory.validation'
import prisma from '../../database'
import { Prisma } from '../../generated/client';

export const InventoryRepository = {
  async findAll(filter: Omit<FilterInventoryParams, 'page'> & { skip: number; limit: number }) {
    const whereClause: Prisma.InventoryWhereInput = {}

    if (filter.condition) {
      whereClause.condition = filter.condition
    }

    if (filter.categoryId) {
      whereClause.categoryId = filter.categoryId
    }

    if (filter.search) {
      whereClause.OR = [
        { itemName: { contains: filter.search, mode: 'insensitive' } },
        { itemCode: { contains: filter.search, mode: 'insensitive' } }
      ]
    }

    const [data, total] = await Promise.all([
      prisma.inventory.findMany({
        where: whereClause,
        include: {
          manager: { select: { id: true, username: true, email: true } },
          inventoryLoans: {
            select: {
              id: true,
              borrowerName: true,
              loanDate: true,
              expectedReturnDate: true,
              actualReturnDate: true,
              status: true
            },
            where: { status: { not: 'returned' } }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: filter.skip,
        take: filter.limit
      }),
      prisma.inventory.count({ where: whereClause })
    ])

    return {
      data,
      meta: {
        total,
        page: Math.floor(filter.skip / filter.limit) + 1,
        limit: filter.limit,
        totalPages: Math.ceil(total / filter.limit)
      }
    }
  },

  async findById(id: number) {
    return prisma.inventory.findUnique({
      where: { id },
      include: {
        manager: { select: { id: true, username: true, email: true } },
        inventoryLoans: {
          select: {
            id: true,
            borrowerName: true,
            loanDate: true,
            expectedReturnDate: true,
            actualReturnDate: true,
            status: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  },

  async create(data: CreateInventoryInput) {
    return prisma.inventory.create({
      data: {
        itemCode: data.itemCode,
        itemName: data.itemName,
        photoUrl: data.photoUrl,
        categoryId: data.categoryId,
        quantity: data.quantity,
        condition: data.condition,
        acquiredDate: data.acquiredDate,
        acquisitionCost: data.acquisitionCost,
        notes: data.notes,
        managedBy: data.managedBy
      },
      include: {
        manager: { select: { id: true, username: true, email: true } }
      }
    })
  },

  async update(id: number, data: UpdateInventoryInput) {
    return prisma.inventory.update({
      where: { id },
      data,
      include: {
        manager: { select: { id: true, username: true, email: true } },
        inventoryLoans: { select: { id: true } }
      }
    })
  },

  async delete(id: number) {
    return prisma.inventory.delete({ where: { id } })
  }
}