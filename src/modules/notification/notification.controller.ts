// notification.controller.ts

import type {
  Request,
  Response,
} from 'express'

import crypto from 'crypto'

import {
  NotificationType,
} from '../../generated/client'

import {
  NotificationService,
} from './notification.service'

import {
  NotificationSSE,
} from './notification.sse'

const getErrorMessage = (
  error: unknown
): string => {

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {

    return String(
      (
        error as {
          message: unknown
        }
      ).message
    )
  }

  return 'Internal server error'
}

const isPrismaNotFoundError = (
  error: unknown
): boolean => {

  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (
      error as {
        code: unknown
      }
    ).code === 'P2025'
  )
}

const parseNotificationType = (
  value: unknown
): NotificationType | undefined => {

  if (
    typeof value !== 'string'
  ) {
    return undefined
  }

  const validTypes =
    Object.values(NotificationType)

  return validTypes.includes(
    value as NotificationType
  )
    ? (value as NotificationType)
    : undefined
}

export const streamNotifications =
  async (
    req: Request,
    res: Response
  ) => {

    try {
      res.setHeader(
        'Content-Type',
        'text/event-stream'
      )

      res.setHeader(
        'Cache-Control',
        'no-cache'
      )

      res.setHeader(
        'Connection',
        'keep-alive'
      )

      res.setHeader(
        'X-Accel-Buffering',
        'no'
      )

      res.flushHeaders()

      const clientId =
        crypto.randomUUID()

      NotificationSSE.addClient(
        clientId,
        res
      )

      res.write(
        `data: ${JSON.stringify({
          type: 'connected',
        })}\n\n`
      )

      // heartbeat
      const interval =
        setInterval(() => {

          res.write(
            `: heartbeat\n\n`
          )
        }, 30000)

      req.on('close', () => {

        clearInterval(interval)

        NotificationSSE.removeClient(
          clientId
        )

        res.end()
      })
    } catch (error: unknown) {

      return res.status(500).json({
        success: false,
        message:
          getErrorMessage(error),
      })
    }
  }

export const getNotifications =
  async (
    req: Request,
    res: Response
  ) => {

    try {
      const page =
        Number(req.query.page) || 1

      const limit =
        Number(req.query.limit) || 10

      if (
        page < 1 ||
        limit < 1
      ) {

        return res.status(400).json({
          success: false,

          message:
            'Page and limit must be positive numbers',
        })
      }

      const isRead =
        req.query.isRead === 'true'
          ? true
          : req.query.isRead === 'false'
            ? false
            : undefined

      const type =
        parseNotificationType(
          req.query.type
        )

      const result =
        await NotificationService.getAll({
          page,
          limit,

          filters: {
            isRead,
            type,
          },
        })

      return res.status(200).json({
        success: true,
        ...result,
      })
    } catch (error: unknown) {

      return res.status(500).json({
        success: false,
        message:
          getErrorMessage(error),
      })
    }
  }

export const markNotificationRead =
  async (
    req: Request,
    res: Response
  ) => {

    try {
      const id =
        Number(req.params.id)

      if (
        Number.isNaN(id) ||
        id < 1
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid notification ID',
        })
      }

      const notification =
        await NotificationService.read(
          id
        )

      return res.status(200).json({
        success: true,
        data: notification,
      })
    } catch (error: unknown) {

      const statusCode =
        isPrismaNotFoundError(error)
          ? 404
          : 500

      return res.status(statusCode).json({
        success: false,

        message:
          statusCode === 404
            ? 'Notification not found'
            : getErrorMessage(error),
      })
    }
  }

export const markAllNotificationsRead =
  async (
    _req: Request,
    res: Response
  ) => {

    try {
      await NotificationService.readAll()

      return res.status(200).json({
        success: true,

        message:
          'All notifications marked as read',
      })
    } catch (error: unknown) {

      return res.status(500).json({
        success: false,
        message:
          getErrorMessage(error),
      })
    }
  }

export const deleteNotification =
  async (
    req: Request,
    res: Response
  ) => {

    try {
      const id =
        Number(req.params.id)

      if (
        Number.isNaN(id) ||
        id < 1
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Invalid notification ID',
        })
      }

      await NotificationService.remove(
        id
      )

      return res.status(200).json({
        success: true,

        message:
          'Notification deleted successfully',
      })
    } catch (error: unknown) {

      const statusCode =
        isPrismaNotFoundError(error)
          ? 404
          : 500

      return res.status(statusCode).json({
        success: false,

        message:
          statusCode === 404
            ? 'Notification not found'
            : getErrorMessage(error),
      })
    }
  }