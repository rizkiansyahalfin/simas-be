import { Router } from "express"

import {
  PaymentController
} from "./payment.controller"

const router = Router()

router.post(
  "/create-transaction",
  PaymentController
    .createTransaction
)

router.post(
  "/notification",
  PaymentController
    .notification
)

export default router