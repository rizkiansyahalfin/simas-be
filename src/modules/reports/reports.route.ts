import { Router } from "express"
import { ReportsController } from "./reports.controller"
import { authMiddleware } from "../../middleware/auth.middleware"
import { rbacMiddleware } from "../../middleware/rbac.middleware"

const router = Router()

router.get(
  "/finance/monthly",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  ReportsController.monthlyFinance
)

export default router