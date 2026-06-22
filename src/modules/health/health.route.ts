// health.route.ts
import { Router } from "express"
import { HealthController } from "./health.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router =
  Router()

router.get(
  "/",
  asyncHandler(HealthController.basic)
)

router.get(
  "/detailed",
  authMiddleware,
  rbacMiddleware("superadmin"),
  asyncHandler(HealthController.detailed)
)

export default router