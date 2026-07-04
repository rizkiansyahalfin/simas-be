import { Router } from "express"
import { AuditAction } from '../../generated/client'
import { UserController } from "./user.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"
import { auditMiddleware } from '../audit/audit.middleware'
import { uploadProfileImage } from "../../middlewares/upload.middleware"

const router = Router()

router.use(authMiddleware, rbacMiddleware("superadmin"))

router.get("/", asyncHandler(UserController.getAll))
router.post(
  "/",
  auditMiddleware({
    action: AuditAction.create,
    module: 'users',
  }),
  asyncHandler(UserController.create)
)
router.put(
  "/:id",
  auditMiddleware({
    action: AuditAction.update,
    module: 'users',
  }),
  asyncHandler(UserController.update)
)

router.get(
  "/profile",
  authMiddleware,
  asyncHandler(UserController.getProfile)
)

router.put(
  "/profile",
  authMiddleware,
  uploadProfileImage.single("photo"),
  asyncHandler(UserController.updateProfile)
)

router.patch("/:id/activate", asyncHandler(UserController.activate))
router.patch("/:id/deactivate", asyncHandler(UserController.deactivate))

export default router