import { Router } from "express"
import { PrayerController } from "./prayer.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router = Router()

router.get("/", PrayerController.getSchedule)

router.get(
  "/weekly",
  PrayerController.getWeeklySchedule
)

router.post(
  "/sync",
  authMiddleware,
  rbacMiddleware("superadmin"),
  PrayerController.sync
)

export default router