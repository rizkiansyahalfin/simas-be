import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { DistributionController } from "./distribution.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

router.get(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  asyncHandler(DistributionController.getHistory)
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  auditMiddleware({
    action: AuditAction.create,
    module: 'mustahik-distribution',
  }),
  asyncHandler(DistributionController.create)
)

export default router