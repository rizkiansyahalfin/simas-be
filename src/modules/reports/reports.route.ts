import { Router } from "express"
import { ReportsController } from "./reports.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from "../audit/audit.middleware"
import { AuditAction } from "../../generated/client"

const router = Router()

router.get(
  "/finance/monthly",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  asyncHandler(ReportsController.monthlyFinance)
)

router.get(
  "/inventory",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  asyncHandler(ReportsController.inventoryExcel)
)

router.get(
  "/finance/weekly",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
  asyncHandler(ReportsController.weeklyFinanceExcel)
)

router.get(
  "/zis/monthly",
  authMiddleware,
  rbacMiddleware("superadmin", "bendahara"),
   auditMiddleware({ action: AuditAction.create, module: "report-zis"}),
  asyncHandler(ReportsController.monthlyZis)
)

router.get(
  "/donations",
  authMiddleware,
  rbacMiddleware("superadmin","bendahara"),
  asyncHandler(ReportsController.donationsExcel)
)

router.get(
  "/inventory/full",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_inventaris"
  ),
  asyncHandler(ReportsController.inventoryFull)
)

router.get(
  "/congregations",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  asyncHandler(ReportsController.congregations)
)

router.get(
  "/annual",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "bendahara"
  ),
  asyncHandler(ReportsController.annualReport)
)

export default router