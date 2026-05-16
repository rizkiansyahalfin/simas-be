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

router.get(
  "/inventory",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  ReportsController.inventoryExcel
)

router.get(
  "/finance/weekly",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  ReportsController.weeklyFinanceExcel
)

export default router