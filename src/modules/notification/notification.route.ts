// notification.route.ts

import { Router } from 'express'

import * as notificationController
from './notification.controller'

import {
  authMiddleware,
} from '../../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get(
  '/',
  notificationController.getNotifications
)

router.get(
  '/stream',
  notificationController.streamNotifications
)

router.patch(
  '/:id/read',
  notificationController.markNotificationRead
)

router.patch(
  '/read-all',
  notificationController.markAllNotificationsRead
)

router.delete(
  '/:id',
  notificationController.deleteNotification
)

export default router