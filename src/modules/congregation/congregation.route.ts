import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { CongregationController } from "./congregation.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'
import { uploadCongregationImport } from "../../middlewares/upload.middleware"

const router = Router()
const controller = CongregationController


router.get(
  "/",
  authMiddleware,
  asyncHandler(controller.getAll)
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
  asyncHandler(controller.create)
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
  asyncHandler(controller.update)
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
  asyncHandler(controller.delete)
)

router.get(
  "/:id/qr-code",
  authMiddleware,
  controller.getQrCode
)

router.get(
  "/export",
  authMiddleware,
  asyncHandler(controller.export)
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
  asyncHandler(controller.import)
)

export default router