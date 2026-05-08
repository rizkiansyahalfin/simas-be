import { Router } from "express"

import { EventController } from "./event.controller"

import { authMiddleware } from "../../middleware/auth.middleware"
import { rbacMiddleware } from "../../middleware/rbac.middleware"

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
  EventController.create
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  EventController.update
)

router.patch(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
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