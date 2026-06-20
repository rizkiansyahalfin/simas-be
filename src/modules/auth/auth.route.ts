import { Router } from "express"
import { AuthController } from "./auth.controller"
import { asyncHandler } from "../../utils/async-handler"
import { bruteForceMiddleware } from "../../middlewares/brute-force.middleware"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { auditMiddleware }from "../audit/audit.middleware"
import { AuditAction }from "../../generated/client"

const router = Router()

router.post(
    "/login", 
    bruteForceMiddleware, 
    asyncHandler(AuthController.login)
  )

router.post(
  "/login/2fa",
  bruteForceMiddleware,
  asyncHandler(AuthController.verifyLoginTwoFactor)
)

router.post(
  "/refresh",
  asyncHandler(AuthController.refresh)
  )

  router.post(
  "/2fa/setup",
  authMiddleware,

  auditMiddleware({
    action: AuditAction.update,
    module: "auth-2fa"
  }),

  asyncHandler(AuthController.setupTwoFactor)
)

router.post(
  "/2fa/verify",
  authMiddleware,

  auditMiddleware({
    action: AuditAction.update,
    module: "auth-2fa"
  }),

  asyncHandler(AuthController.verifyTwoFactor)
)

router.post(
  "/2fa/disable",
  authMiddleware,

  auditMiddleware({
    action: AuditAction.update,
    module: "auth-2fa"
  }),

  asyncHandler(AuthController.disableTwoFactor)
)

router.post(
  "/forgot-password",
  bruteForceMiddleware,
  asyncHandler(AuthController.forgotPassword)
)

router.post(
  "/reset-password",
  bruteForceMiddleware,
  asyncHandler(AuthController.resetPassword)
)

export default router