import { Router } from "express"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from "../audit/audit.middleware"
import { AuditAction } from "../../generated/client"
import { midtransWebhookAuth } from "./payment.middleware"

import { PaymentController } from "./payment.controller"

const router = Router()

router.post(
  "/create-transaction",
  PaymentController.createTransaction
)

router.get(
  "/:orderId/status",
  PaymentController.getStatus
)

router.post(
  "/:orderId/refund",
  authMiddleware,
  rbacMiddleware("superadmin"),
  auditMiddleware({
    action: AuditAction.update,
    module: "payments",
  }),
  PaymentController.refund
)

router.post(
  "/notification",
  midtransWebhookAuth,
  PaymentController.notification
)

export default router