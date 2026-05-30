// audit.type.ts

import type {
  AuditAction,
  Prisma,
} from '../../generated/client'

export type CreateAuditLogInput = {
  userId?: number
  action: AuditAction

  module: string
  entityId?: string

  ipAddress?: string
  userAgent?: string

  beforeData?: Prisma.InputJsonValue
  afterData?: Prisma.InputJsonValue
}

export type AuditLogFilters = {
  action?: AuditAction
  module?: string

  startDate?: Date
  endDate?: Date
}

export type PaginatedResponse<T> = {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}