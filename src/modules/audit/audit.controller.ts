// audit.controller.ts

import type {
  Request,
  Response,
} from 'express'

import {
  AuditAction,
} from '../../generated/client'

import * as auditService from './audit.service'

export const getAuditLogs = async (
  req: Request,
  res: Response
) => {

  const page =
    Number(req.query.page) || 1

  const limit =
    Number(req.query.limit) || 10

  const action =
    req.query.action as
      | AuditAction
      | undefined

  const module =
    req.query.module as
      | string
      | undefined

  const startDate =
    req.query.startDate
      ? new Date(
          String(req.query.startDate)
        )
      : undefined

  const endDate =
    req.query.endDate
      ? new Date(
          String(req.query.endDate)
        )
      : undefined

  const data =
    await auditService.getAuditLogs({
      page,
      limit,

      filters: {
        action,
        module,
        startDate,
        endDate,
      },
    })

  return res.status(200).json({
    success: true,
    ...data,
  })
}