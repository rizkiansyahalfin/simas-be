import {  Router} from "express"
import {  BackupController} from "./backup.controller"
import {  authMiddleware} from "../../middlewares/auth.middleware"
import {  rbacMiddleware} from "../../middlewares/rbac.middleware"
import {auditMiddleware} from "../audit/audit.middleware"
import {  Role} from "../../generated/enums"
import { AuditAction} from "../../generated/client"

const router =
  Router()

router.post(
  "/backup",

  authMiddleware,

  rbacMiddleware(
    Role.superadmin
  ),

  auditMiddleware({
    action:
      AuditAction.create,

    module:
      "database-backup"
  }),

  BackupController
    .createBackup
)

export default router