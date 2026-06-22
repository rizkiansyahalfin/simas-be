import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { AttendanceController } from "./attendance.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

// Public
router.get("/", asyncHandler(AttendanceController.getAll))
router.get(
	"/report",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_kegiatan"),
	asyncHandler(AttendanceController.report)
)
router.get("/:id", asyncHandler(AttendanceController.getById))
router.post("/checkin", asyncHandler(AttendanceController.checkIn))

router.post(
	"/",
	authMiddleware,
	rbacMiddleware("superadmin", "admin_kegiatan"),
	auditMiddleware({ action: AuditAction.create, module: 'attendance' }),
	asyncHandler(AttendanceController.create)
)

router.put(
	"/:id",
	authMiddleware,
	rbacMiddleware("superadmin", "admin_kegiatan"),
	auditMiddleware({ action: AuditAction.update, module: 'attendance' }),
	asyncHandler(AttendanceController.update)
)

router.delete(
	"/:id",
	authMiddleware,
	rbacMiddleware("superadmin", "admin_kegiatan"),
	auditMiddleware({ action: AuditAction.delete, module: 'attendance' }),
	asyncHandler(AttendanceController.delete)
)

export default router
