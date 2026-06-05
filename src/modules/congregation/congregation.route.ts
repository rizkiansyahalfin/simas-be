import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { CongregationController } from "./congregation.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'
import { uploadCongregationImport } from "../../middlewares/upload.middleware"

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

router.get(
  "/export",
  authMiddleware,
  controller.export
)

router.post(
  "/import",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  uploadCongregationImport.single("file"),
  auditMiddleware({
    action: AuditAction.create,
    module: "congregation",
  }),
  controller.import
)

export default router