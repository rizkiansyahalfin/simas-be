// notification.route.ts

import { Router } from 'express'

import * as notificationController
from './notification.controller'
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

  rbacMiddleware(
    Role.superadmin,
    Role.bendahara,
    Role.admin_kegiatan,
    Role.admin_inventaris,
  ),

  asyncHandler(notificationController.getNotifications)
)

router.get(
  '/stream',

  rbacMiddleware(
    Role.superadmin,
    Role.bendahara,
    Role.admin_kegiatan,
    Role.admin_inventaris,
  ),

  asyncHandler(notificationController.streamNotifications)
)

router.patch(
  '/:id/read',

  rbacMiddleware(
    Role.superadmin,
    Role.bendahara,
    Role.admin_kegiatan,
    Role.admin_inventaris,
  ),

  asyncHandler(notificationController.markNotificationRead)
)

router.patch(
  '/read-all',

  rbacMiddleware(
    Role.superadmin,
    Role.bendahara,
    Role.admin_kegiatan,
    Role.admin_inventaris,
  ),

  asyncHandler(notificationController.markAllNotificationsRead)
)

router.delete(
  '/:id',

  rbacMiddleware(
    Role.superadmin,
  ),

  asyncHandler(notificationController.deleteNotification)
)

export default router