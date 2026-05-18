import { Router } from "express"
import { PrayerController } from "./prayer.controller"
import { authMiddleware } from "../../middleware/auth.middleware"
import { rbacMiddleware } from "../../middleware/rbac.middleware"

const router = Router()

router.get("/", PrayerController.getSchedule)

router.post(
  "/sync",
  authMiddleware,
  rbacMiddleware("superadmin"),
  PrayerController.sync
)

export default router