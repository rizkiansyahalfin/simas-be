import { Router } from "express"
import { AuditAction } from '../../generated/client'

import { EventController } from "./event.controller"
import { asyncHandler } from "../../utils/async-handler"


import { uploadEventPoster } from "../../middlewares/upload.middleware"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

// PUBLIC
router.get("/", asyncHandler(EventController.getAll))

// ADMIN
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  uploadEventPoster.single("poster"),
  auditMiddleware({
    action: AuditAction.create,
    module: "events",
  }),
  asyncHandler(EventController.create)
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  uploadEventPoster.single("poster"),
  auditMiddleware({
    action: AuditAction.update,
    module: "events",
  }),
  asyncHandler(EventController.update)
)

router.patch(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  auditMiddleware({
    action: AuditAction.update,
    module: 'events',
  }),
  asyncHandler(EventController.updateStatus)
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  asyncHandler(EventController.delete)
)

export default router