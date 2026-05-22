import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { DistributionController } from "./distribution.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

router.get(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  DistributionController.getHistory
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  auditMiddleware({
    action: AuditAction.create,
    module: 'mustahik-distribution',
  }),
  DistributionController.create
)

export default router