import { Router } from "express"

import * as controller
from "./article-category.controller"
import { asyncHandler } from "../../utils/async-handler"

import {
  authMiddleware
} from "../../middlewares/auth.middleware"

import {
  rbacMiddleware
} from "../../middlewares/rbac.middleware"

const router = Router()

router.get(
  "/",
  asyncHandler(controller.getAll)
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin"),
  asyncHandler(controller.create)
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin"),
  asyncHandler(controller.update)
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin"),
  asyncHandler(controller.deleteCategory)
)

export default router