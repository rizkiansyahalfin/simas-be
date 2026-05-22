// audit.middleware.ts

import type {
  Request,
  Response,
  NextFunction,
} from 'express'

import type {
  AuditAction,
} from '../../generated/client'

import * as auditService from './audit.service'

interface AuditRequest extends Request {
  audit?: {
    action: AuditAction
    module: string
  }
}

export const auditMiddleware = ({
  action,
  module,
}: {
  action: AuditAction
  module: string
}) => {

  return (
    req: AuditRequest,
    res: Response,
    next: NextFunction
  ) => {

    req.audit = {
      action,
      module,
    }

    res.on('finish', async () => {
      if (!req.audit) {
        return
      }

      if (res.statusCode >= 400) {
        return
      }

      if (!req.user?.id) {
        return
      }

      try {
        await auditService.logAudit({
          userId: req.user.id,
          action: req.audit.action,
          module: req.audit.module,
          entityId:
            req.params?.id !== undefined
              ? String(req.params.id)
              : undefined,
          ipAddress:
            req.ip ||
            String(req.headers['x-forwarded-for'] || ''),
          userAgent:
            typeof req.headers['user-agent'] === 'string'
              ? req.headers['user-agent']
              : undefined,
        })
      } catch (error) {
        console.error('Audit logging failed', error)
      }
    })

    next()
  }
}