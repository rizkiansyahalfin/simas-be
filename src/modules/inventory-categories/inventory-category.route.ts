import { Router } from "express"
import { InventoryCategoryController } from "./inventory-category.controller"
import { asyncHandler } from "../../utils/async-handler"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router = Router()

router.get("/", asyncHandler(InventoryCategoryController.getAll))

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  asyncHandler(InventoryCategoryController.create)
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  asyncHandler(InventoryCategoryController.update)
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  asyncHandler(InventoryCategoryController.delete)
)

export default router
