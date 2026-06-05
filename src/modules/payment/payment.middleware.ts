import type {
  Request,
  Response,
  NextFunction,
} from "express"

import {
  validateWebhookSecret,
} from "./payment.utils"

export const midtransWebhookAuth =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const secret =
      req.headers[
        "x-webhook-secret"
      ] as string

    if (
      !validateWebhookSecret(secret)
    ) {
      return res.status(401).json({
        status: "error",
        message:
          "INVALID_WEBHOOK_SECRET",
      })
    }

    next()
  }