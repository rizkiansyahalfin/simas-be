import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { AttendanceController } from "./attendance.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

// Public
router.get("/", AttendanceController.getAll)
router.get(
  "/report",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_kegiatan"),
  AttendanceController.report
)
router.get("/:id", AttendanceController.getById)
router.post("/checkin", AttendanceController.checkIn)

router.post(
	"/",
	authMiddleware,
	rbacMiddleware("superadmin", "admin_kegiatan"),
	auditMiddleware({ action: AuditAction.create, module: 'attendance' }),
	AttendanceController.create
)

router.put(
	"/:id",
	authMiddleware,
	rbacMiddleware("superadmin", "admin_kegiatan"),
	auditMiddleware({ action: AuditAction.update, module: 'attendance' }),
	AttendanceController.update
)

router.delete(
	"/:id",
	authMiddleware,
	rbacMiddleware("superadmin", "admin_kegiatan"),
	auditMiddleware({ action: AuditAction.delete, module: 'attendance' }),
	AttendanceController.delete
)

export default router
