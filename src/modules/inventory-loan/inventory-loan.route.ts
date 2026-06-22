import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { InventoryLoanController } from "./inventory-loan.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()
const controller = InventoryLoanController

router.get(
  "/",
  authMiddleware,
  asyncHandler(controller.getAll)
)

router.get(
  "/:id",
  authMiddleware,
  asyncHandler(controller.getById)
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  auditMiddleware({
    action: AuditAction.create,
    module: 'inventory-loan',
  }),
  asyncHandler(controller.create)
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  auditMiddleware({
    action: AuditAction.update,
    module: 'inventory-loan',
  }),
  asyncHandler(controller.update)
)

router.put(
  "/:id/return",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  auditMiddleware({
    action: AuditAction.update,
    module: 'inventory-loan',
  }),
  asyncHandler(controller.returnLoan)
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  auditMiddleware({
    action: AuditAction.delete,
    module: 'inventory-loan',
  }),
  asyncHandler(controller.delete)
)

export default router