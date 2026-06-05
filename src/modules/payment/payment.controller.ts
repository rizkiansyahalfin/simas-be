import type {
  Request,
  Response,
  NextFunction,
} from "express"

import { createTransactionSchema, refundSchema } from "./payment.validation"
import { PaymentService } from "./payment.service"

export const PaymentController = {
  async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validated = createTransactionSchema.parse(req.body)
      const result = await PaymentService.createTransaction(validated)

      res.status(201).json({
        status: "success",
        data: result,
      })
    } catch (err) {
      next(err)
    }
  },

  async getStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.orderId as string
      const result = await PaymentService.getTransactionStatus(orderId)

      res.json({
        status: "success",
        data: result,
      })
    } catch (err) {
      next(err)
    }
  },

  async refund(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderId = req.params.orderId
      const body = refundSchema.parse(req.body)

      const result = await PaymentService.refund(
        orderId as string,
        body.reason,
        body.amount
      )

      res.json({
        status: "success",
        data: result,
      })
    } catch (err) {
      next(err)
    }
  },

  async notification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await PaymentService.handleNotification(req.body)

      res.status(200).json({ received: true })
    } catch (err) {
      next(err)
    }
  },
}
