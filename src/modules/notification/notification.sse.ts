// notification.sse.ts

import type {
  Response,
} from 'express'

import type {
  Notification,
} from '../../generated/client'

const clients = new Map<
  string,
  Response
>()

export const NotificationSSE = {
  addClient(
    clientId: string,
    res: Response
  ) {

    clients.set(clientId, res)
  },

  removeClient(
    clientId: string
  ) {

    clients.delete(clientId)
  },

  broadcast(
    notification: Notification
  ) {

    const payload = JSON.stringify({
      type: 'notification',
      data: notification,
    })

    for (const [, client] of clients) {
      client.write(
        `data: ${payload}\n\n`
      )
    }
  },
}