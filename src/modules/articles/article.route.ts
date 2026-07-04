import { Router } from "express";
import { AuditAction } from '../../generated/client'
import * as controller from "./article.controller"
import { asyncHandler } from "../../utils/async-handler";
import { rbacMiddleware } from "../../middlewares/rbac.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { auditMiddleware } from '../audit/audit.middleware'

const router = Router()

router.get("/", asyncHandler(controller.getAll))

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_kegiatan"),
  auditMiddleware({
    action: AuditAction.create,
    module: 'articles',
  }),
  asyncHandler(controller.create)
)

router.put(
  "/:id",
  authMiddleware,
  auditMiddleware({
    action: AuditAction.update,
    module: 'articles',
  }),
  asyncHandler(controller.update)
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin"),
  auditMiddleware({
    action: AuditAction.delete,
    module: 'articles',
  }),
  asyncHandler(controller.deleteArticle)
)

router.patch(
  "/:id/publish",
  authMiddleware,
  rbacMiddleware("superadmin"),
  asyncHandler(controller.publish)
)

export default router