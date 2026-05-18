import { Router } from "express"
import { DistributionController } from "./distribution.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router = Router()

router.get(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  DistributionController.getHistory
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  DistributionController.create
)

export default router