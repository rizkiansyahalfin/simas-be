// notification.route.ts

import { Router } from 'express'

import * as notificationController
from './notification.controller'

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

  notificationController.getNotifications
)

router.get(
  '/stream',

  rbacMiddleware(
    Role.superadmin,
    Role.bendahara,
    Role.admin_kegiatan,
    Role.admin_inventaris,
  ),

  notificationController.streamNotifications
)

router.patch(
  '/:id/read',

  rbacMiddleware(
    Role.superadmin,
    Role.bendahara,
    Role.admin_kegiatan,
    Role.admin_inventaris,
  ),

  notificationController.markNotificationRead
)

router.patch(
  '/read-all',

  rbacMiddleware(
    Role.superadmin,
    Role.bendahara,
    Role.admin_kegiatan,
    Role.admin_inventaris,
  ),

  notificationController.markAllNotificationsRead
)

router.delete(
  '/:id',

  rbacMiddleware(
    Role.superadmin,
  ),

  notificationController.deleteNotification
)

export default router