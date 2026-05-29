import { Router } from "express"

import * as controller
from "./article-category.controller"

import {
  authMiddleware
} from "../../middlewares/auth.middleware"

import {
  rbacMiddleware
} from "../../middlewares/rbac.middleware"

const router = Router()

router.get(
  "/",
  controller.getAll
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin"),
  controller.create
)

router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin"),
  controller.update
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin"),
  controller.deleteCategory
)

export default router