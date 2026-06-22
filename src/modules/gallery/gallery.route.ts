import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { GalleryController } from "./gallery.controller"
import { asyncHandler } from "../../utils/async-handler"

import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

import { uploadImage } from "../../middlewares/upload.middleware"

const router = Router()

router.get("/", asyncHandler(GalleryController.findAll))

router.post(
  "/",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  auditMiddleware({
    action: AuditAction.create,
    module: 'gallery',
  }),
  uploadImage.array("images", 10),
  asyncHandler(GalleryController.create)
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  auditMiddleware({
    action: AuditAction.delete,
    module: 'gallery',
  }),
  asyncHandler(GalleryController.delete)
)

export default router