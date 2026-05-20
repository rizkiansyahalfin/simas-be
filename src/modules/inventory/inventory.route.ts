import { Router } from 'express'
import { InventoryController } from './inventory.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rbacMiddleware } from '../../middlewares/rbac.middleware'

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
  controller.create
)

router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  controller.update
)

router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware('superadmin', 'admin_inventaris'),
  controller.delete
)

export default router