import { Router } from "express"
import { UserController } from "./user.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router = Router()

router.use(authMiddleware, rbacMiddleware("superadmin"))

router.get("/", UserController.getAll)
router.post("/", UserController.create)
router.put("/:id", UserController.update)

router.patch("/:id/activate", UserController.activate)
router.patch("/:id/deactivate", UserController.deactivate)

export default router