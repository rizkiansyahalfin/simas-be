// audit.service.ts

import * as repo from './audit.repository'

import type {
  AuditLogFilters,
  CreateAuditLogInput,
  PaginatedResponse,
} from './audit.type'

export const logAudit = async (
  data: CreateAuditLogInput
) => {

  return await repo.createAuditLog(data)
}

export const getAuditLogs = async ({
  page = 1,
  limit = 10,
  filters = {},
}: {
  page?: number
  limit?: number
  filters?: AuditLogFilters
}): Promise<
  PaginatedResponse<
    Awaited<
      ReturnType<typeof repo.findAuditLogs>
    >[number]
  >
> => {

  const [data, total] =
    await Promise.all([
      repo.findAuditLogs({
        page,
        limit,
        filters,
      }),

      repo.countAuditLogs(filters),
    ])

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.max(
      1,
      Math.ceil(total / limit)
    ),
  }
}