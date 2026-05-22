// notification.repository.ts

import prisma from '../../database'

import type {
  Prisma,
} from '../../generated/client'

import type {
  CreateNotificationInput,
  NotificationFilters,
} from './notification.type'

export const NotificationRepository = {
  async create(
    data: CreateNotificationInput
  ) {

    return await prisma.notification.create({
      data,
    })
  },

  async findByUniqueKey(
    uniqueKey: string
  ) {

    return await prisma.notification.findUnique({
      where: {
        uniqueKey,
      },
    })
  },

  async findAll({
    page,
    limit,
    filters,
  }: {
    page: number
    limit: number
    filters: NotificationFilters
  }) {

    const where:
      Prisma.NotificationWhereInput = {}

    if (
      typeof filters.isRead ===
      'boolean'
    ) {
      where.isRead = filters.isRead
    }

    if (filters.type) {
      where.type = filters.type
    }

    const [data, total] =
      await Promise.all([
        prisma.notification.findMany({
          where,

          skip: (page - 1) * limit,
          take: limit,

          orderBy: {
            createdAt: 'desc',
          },
        }),

        prisma.notification.count({
          where,
        }),
      ])

    return {
      data,
      total,
    }
  },

  async markAsRead(id: number) {

    return await prisma.notification.update({
      where: {
        id,
      },

      data: {
        isRead: true,
        readAt: new Date(),
      },
    })
  },

  async markAllAsRead() {

    return await prisma.notification.updateMany({
      where: {
        isRead: false,
      },

      data: {
        isRead: true,
        readAt: new Date(),
      },
    })
  },

  async delete(id: number) {

    return await prisma.notification.delete({
      where: {
        id,
      },
    })
  },
}