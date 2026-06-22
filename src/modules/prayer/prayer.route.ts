import { Router } from "express"
import { PrayerController } from "./prayer.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router = Router()

router.get("/", asyncHandler(PrayerController.getSchedule))

router.get(
  "/weekly",
  asyncHandler(PrayerController.getWeeklySchedule)
)

router.post(
  "/sync",
  authMiddleware,
  rbacMiddleware("superadmin"),
  asyncHandler(PrayerController.sync)
)

export default router