import { Router } from "express"
import { ReportsController } from "./reports.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from "../audit/audit.middleware"
import { AuditAction } from "../../generated/client"

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

router.get(
  "/zis/monthly",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
   auditMiddleware({ action: AuditAction.create, module: "report-zis"}),
  ReportsController.monthlyZis
)

export default router