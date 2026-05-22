// audit.repository.ts

import prisma from '../../database'

import type {
  Prisma,
} from '../../generated/client'

import type {
  AuditLogFilters,
  CreateAuditLogInput,
} from './audit.type'

export const createAuditLog = async (
  data: CreateAuditLogInput
) => {

  return await prisma.auditLog.create({
    data,
  })
}

export const findAuditLogs = async ({
  page,
  limit,
  filters,
}: {
  page: number
  limit: number
  filters: AuditLogFilters
}) => {

  const where: Prisma.AuditLogWhereInput = {}

  if (filters.action) {
    where.action = filters.action
  }

  if (filters.module) {
    where.module = {
      contains: filters.module,
      mode: 'insensitive',
    }
  }

  if (
    filters.startDate ||
    filters.endDate
  ) {
    where.createdAt = {}

    if (filters.startDate) {
      where.createdAt.gte =
        filters.startDate
    }

    if (filters.endDate) {
      where.createdAt.lte =
        filters.endDate
    }
  }

  return await prisma.auditLog.findMany({
    where,

    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      },
    },

    skip: (page - 1) * limit,
    take: limit,

    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const countAuditLogs = async (
  filters: AuditLogFilters
) => {

  const where: Prisma.AuditLogWhereInput = {}

  if (filters.action) {
    where.action = filters.action
  }

  if (filters.module) {
    where.module = {
      contains: filters.module,
      mode: 'insensitive',
    }
  }

  if (
    filters.startDate ||
    filters.endDate
  ) {
    where.createdAt = {}

    if (filters.startDate) {
      where.createdAt.gte =
        filters.startDate
    }

    if (filters.endDate) {
      where.createdAt.lte =
        filters.endDate
    }
  }

  return await prisma.auditLog.count({
    where,
  })
}