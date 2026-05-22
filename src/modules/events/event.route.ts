import { Router } from "express"
import { AuditAction } from '../../generated/client'

import { EventController } from "./event.controller"

import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

// PUBLIC
router.get("/", EventController.getAll)

// ADMIN
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  auditMiddleware({
    action: AuditAction.create,
    module: 'events',
  }),
  EventController.create
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
    module: 'events',
  }),
  EventController.update
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
  EventController.updateStatus
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  EventController.delete
)

export default router