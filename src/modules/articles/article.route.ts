import { Router } from "express";
import { AuditAction } from '../../generated/client'
import * as controller from "./article.controller"
import { rbacMiddleware } from "../../middlewares/rbac.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

router.get("/", controller.getAll)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_kegiatan"),
  auditMiddleware({
    action: AuditAction.create,
    module: 'articles',
  }),
  controller.create
)

router.put(
  "/:id",
  authMiddleware,
  auditMiddleware({
    action: AuditAction.update,
    module: 'articles',
  }),
  controller.update
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin"),
  auditMiddleware({
    action: AuditAction.delete,
    module: 'articles',
  }),
  controller.deleteArticle
)

router.patch(
  "/:id/publish",
  authMiddleware,
  rbacMiddleware("superadmin"),
  controller.publish
)

export default router