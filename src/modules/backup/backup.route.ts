import { Router } from "express"
import { BackupController } from "./backup.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from "../audit/audit.middleware"
import { Role } from "../../generated/enums"
import { AuditAction } from "../../generated/client"
import { uploadRestoreBackup } from "../../middlewares/upload.middleware"

const router = Router()

// Superadmin only - create backup
router.post(
  "/backup",
  authMiddleware,
  rbacMiddleware(Role.superadmin),
  auditMiddleware({
    action: AuditAction.create,
    module: "database-backup"
  }),
  BackupController.createBackup
)

// Superadmin only - list backups
router.get(
  "/backup",
  authMiddleware,
  rbacMiddleware(Role.superadmin),
  BackupController.listBackups
)

// Superadmin only - delete backup
router.delete(
  "/backup/:fileName",
  authMiddleware,
  rbacMiddleware(Role.superadmin),
  auditMiddleware({
    action: AuditAction.delete,
    module: "database-backup"
  }),
  BackupController.deleteBackup
)

router.post(
  "/restore/validate",

  authMiddleware,

  rbacMiddleware(
    Role.superadmin
  ),

  auditMiddleware({
    action:
      AuditAction.update,
    module:
      "database-restore"
  }),

  uploadRestoreBackup.single(
    "file"
  ),

  BackupController
    .validateRestore
)

router.post(
  "/restore",

  authMiddleware,

  rbacMiddleware(
    Role.superadmin
  ),

  auditMiddleware({
    action:
      AuditAction.update,
    module:
      "database-restore"
  }),

  BackupController.restore
)

export default router
