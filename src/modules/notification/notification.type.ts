// notification.type.ts

import type {
  Notification,
  NotificationType,
} from '../../generated/client'

export type CreateNotificationInput = {
  title: string
  message: string

  type: NotificationType

  entityId?: string
  entityType?: string

  uniqueKey?: string
}

export type NotificationFilters = {
  isRead?: boolean
  type?: NotificationType
}

export type PaginatedResponse<T> = {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type NotificationListItem =
  Notification