// health.route.ts
import { Router } from "express"
import { HealthController } from "./health.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router =
  Router()

router.get(
  "/",
  HealthController.basic
)

router.get(
  "/detailed",
  authMiddleware,
  rbacMiddleware("superadmin"),
  HealthController.detailed
)

export default router