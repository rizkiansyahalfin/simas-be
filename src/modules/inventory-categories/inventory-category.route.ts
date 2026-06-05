import { Router } from "express"
import { InventoryCategoryController } from "./inventory-category.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

const router = Router()

router.get("/", InventoryCategoryController.getAll)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  InventoryCategoryController.create
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  InventoryCategoryController.update
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_inventaris"),
  InventoryCategoryController.delete
)

export default router
