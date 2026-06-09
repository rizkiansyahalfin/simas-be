import { Router } from "express"
import { AuthController } from "./auth.controller"
import { bruteForceMiddleware } from "../../middlewares/brute-force.middleware"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { auditMiddleware }from "../audit/audit.middleware"
import { AuditAction }from "../../generated/client"

const router = Router()

router.post(
    "/login", 
    bruteForceMiddleware, 
    AuthController.login
  )

router.post(
  "/login/2fa",
  bruteForceMiddleware,
  AuthController.verifyLoginTwoFactor
)

router.post(
  "/refresh",
  AuthController.refresh
  )

  router.post(
  "/2fa/setup",
  authMiddleware,

  auditMiddleware({
    action: AuditAction.update,
    module: "auth-2fa"
  }),

  AuthController.setupTwoFactor
)

router.post(
  "/2fa/verify",
  authMiddleware,

  auditMiddleware({
    action: AuditAction.update,
    module: "auth-2fa"
  }),

  AuthController.verifyTwoFactor
)

router.post(
  "/2fa/disable",
  authMiddleware,

  auditMiddleware({
    action: AuditAction.update,
    module: "auth-2fa"
  }),

  AuthController.disableTwoFactor
)

router.post(
  "/forgot-password",
  bruteForceMiddleware,
  AuthController.forgotPassword
)

router.post(
  "/reset-password",
  bruteForceMiddleware,
  AuthController.resetPassword
)

export default router