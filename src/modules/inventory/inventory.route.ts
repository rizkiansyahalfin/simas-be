import { Router } from 'express'
import { AuditAction } from '../../generated/client'
import { InventoryController } from './inventory.controller'
import { asyncHandler } from '../../utils/async-handler'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rbacMiddleware } from '../../middlewares/rbac.middleware'
import { auditMiddleware } from '../audit/audit.middleware'
import { uploadInventoryPhoto } from '../../middlewares/upload.middleware'

const router = Router()
const controller = InventoryController

router.get(
  '/',
  authMiddleware,
  asyncHandler(controller.getAll)
)

router.get(
  '/:id',
  authMiddleware,
  asyncHandler(controller.getById)
)

router.post(
  '/',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  uploadInventoryPhoto.single('photo'),
  auditMiddleware({
    action: AuditAction.create,
    module: 'inventory',
  }),
  asyncHandler(controller.create)
)

router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  uploadInventoryPhoto.single('photo'),
  auditMiddleware({
    action: AuditAction.update,
    module: 'inventory',
  }),
  asyncHandler(controller.update)
)

router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  auditMiddleware({
    action: AuditAction.delete,
    module: 'inventory',
  }),
  asyncHandler(controller.delete)
)

export default router