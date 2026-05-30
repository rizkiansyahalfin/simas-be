// notification.service.ts

import {
  NotificationRepository,
} from './notification.repository'

import {
  NotificationSSE,
} from './notification.sse'

import type {
  NotificationType,
} from '../../generated/client'

import type {
  CreateNotificationInput,
  NotificationFilters,
  PaginatedResponse,
} from './notification.type'

export const NotificationService = {
  async create(
    data: CreateNotificationInput
  ) {

    if (data.uniqueKey) {
      const existing =
        await NotificationRepository.findByUniqueKey(
          data.uniqueKey
        )

      if (existing) {
        return existing
      }
    }

    const notification =
      await NotificationRepository.create(
        data
      )

    NotificationSSE.broadcast(
      notification
    )

    return notification
  },

  async getAll({
    page = 1,
    limit = 10,
    filters = {},
  }: {
    page?: number
    limit?: number
    filters?: NotificationFilters
  }): Promise<
    PaginatedResponse<
      Awaited<
        ReturnType<
          typeof NotificationRepository.findAll
        >
      >['data'][number]
    >
  > {

    const result =
      await NotificationRepository.findAll({
        page,
        limit,
        filters,
      })

    return {
      data: result.data,
      page,
      limit,
      total: result.total,

      totalPages: Math.max(
        1,
        Math.ceil(
          result.total / limit
        )
      ),
    }
  },

  async read(id: number) {

    return await NotificationRepository.markAsRead(
      id
    )
  },

  async readAll() {

    return await NotificationRepository.markAllAsRead()
  },

  async remove(id: number) {

    return await NotificationRepository.delete(
      id
    )
  },

  async push({
    title,
    message,
    type,

    entityId,
    entityType,

    uniqueKey,
  }: {
    title: string
    message: string

    type: NotificationType

    entityId?: string
    entityType?: string

    uniqueKey?: string
  }) {

    return await this.create({
      title,
      message,

      type,

      entityId,
      entityType,

      uniqueKey,
    })
  },
}