import type {
  Request,
  Response,
} from "express"

import { asyncHandler } from "../../utils/async-handler"
import { createTransactionSchema, refundSchema } from "./payment.validation"
import { PaymentService } from "./payment.service"

export const PaymentController = {
  createTransaction: asyncHandler(async (
    req: Request,
    res: Response
  ) => {
      const validated = createTransactionSchema.parse(req.body)
      const result = await PaymentService.createTransaction(validated)

      res.status(201).json({
        status: "success",
        data: result,
      })
  }),

  getStatus: asyncHandler(async (
    req: Request,
    res: Response
  ) => {
      const orderId = req.params.orderId as string
      const result = await PaymentService.getTransactionStatus(orderId)

      res.json({
        status: "success",
        data: result,
      })
  }),

  refund: asyncHandler(async (
    req: Request,
    res: Response
  ) => {
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
  }),

  notification: asyncHandler(async (
    req: Request,
    res: Response
  ) => {
      await PaymentService.handleNotification(req.body)

      res.status(200).json({ received: true })
  }),
}