import { Router } from "express"
import { AuditAction } from '../../generated/client'

import { MosqueProfileController }
from "./mosque-profile.controller"
import { asyncHandler } from "../../utils/async-handler"

import { authMiddleware }
from "../../middlewares/auth.middleware"

import { rbacMiddleware }
from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

import { uploadImage }
from "../../middlewares/upload.middleware"

const router = Router()

router.get(
  "/",
  asyncHandler(MosqueProfileController.get)
)

router.get(
  "/public-config",
  asyncHandler(MosqueProfileController.getPublicConfig)
)

router.put(
  "/",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  auditMiddleware({
    action: AuditAction.update,
    module: 'mosque-profile',
  }),
  uploadImage.single("qris"),
  asyncHandler(MosqueProfileController.update)
)

export default router