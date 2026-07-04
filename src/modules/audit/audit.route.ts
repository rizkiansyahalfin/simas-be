// audit.route.ts

import { Router } from 'express'

import * as auditController from './audit.controller'
import { asyncHandler } from '../../utils/async-handler'

import {
  authMiddleware,
} from '../../middlewares/auth.middleware'

import {
  rbacMiddleware,
} from '../../middlewares/rbac.middleware'

import {
  Role,
} from '../../generated/enums'

const router = Router()

router.use(authMiddleware)

router.get(
  '/',
  rbacMiddleware(Role.superadmin),
  asyncHandler(auditController.getAuditLogs)
)

export default router