import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { MustahikController } from "./mustahik.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

router.get("/", asyncHandler(MustahikController.getAll))

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  auditMiddleware({
    action: AuditAction.create,
    module: 'mustahik',
  }),
  asyncHandler(MustahikController.create)
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  auditMiddleware({
    action: AuditAction.update,
    module: 'mustahik',
  }),
  asyncHandler(MustahikController.update)
)

export default router