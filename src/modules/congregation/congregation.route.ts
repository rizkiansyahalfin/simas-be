import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { CongregationController } from "./congregation.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()
const controller = CongregationController


router.get(
  "/",
  authMiddleware,
  controller.getAll
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  auditMiddleware({
    action: AuditAction.create,
    module: 'congregation',
  }),
  controller.create
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  auditMiddleware({
    action: AuditAction.update,
    module: 'congregation',
  }),
  controller.update
)

router.patch(
  "/:id/deactivate",
  authMiddleware,
  rbacMiddleware(
    "superadmin"
  ),
  auditMiddleware({
    action: AuditAction.update,
    module: 'congregation',
  }),
  controller.delete
)

export default router