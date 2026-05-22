import { Router } from 'express'
import { AuditAction } from '../../generated/client'
import { InventoryController } from './inventory.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rbacMiddleware } from '../../middlewares/rbac.middleware'
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()
const controller = InventoryController

router.get(
  '/',
  authMiddleware,
  controller.getAll
)

router.get(
  '/:id',
  authMiddleware,
  controller.getById
)

router.post(
  '/',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  auditMiddleware({
    action: AuditAction.create,
    module: 'inventory',
  }),
  controller.create
)

router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  auditMiddleware({
    action: AuditAction.update,
    module: 'inventory',
  }),
  controller.update
)

router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  auditMiddleware({
    action: AuditAction.delete,
    module: 'inventory',
  }),
  controller.delete
)

export default router