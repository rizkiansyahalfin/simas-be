import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { UserController } from "./user.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'
import { uploadProfileImage } from "../../middlewares/upload.middleware"

const router = Router()

router.use(authMiddleware, rbacMiddleware("superadmin"))

router.get("/", UserController.getAll)
router.post(
  "/",
  auditMiddleware({
    action: AuditAction.create,
    module: 'users',
  }),
  UserController.create
)
router.put(
  "/:id",
  auditMiddleware({
    action: AuditAction.update,
    module: 'users',
  }),
  UserController.update
)

router.get(
  "/profile",
  authMiddleware,
  UserController.getProfile
)

router.put(
  "/profile",
  authMiddleware,
  uploadProfileImage.single("photo"),
  UserController.updateProfile
)

router.patch("/:id/activate", UserController.activate)
router.patch("/:id/deactivate", UserController.deactivate)

export default router