import { Router } from "express";
import * as controller from "./article.controller"
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router()

router.get("/", controller.getAll)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware("superadmin", "admin_kegiatan"),
  controller.create
)

router.put(
  "/:id",
  authMiddleware,
  controller.update
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware("superadmin"),
  controller.deleteArticle
)

router.patch(
  "/:id/publish",
  authMiddleware,
  rbacMiddleware("superadmin"),
  controller.publish
)