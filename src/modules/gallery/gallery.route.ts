import { Router } from "express"
import { GalleryController } from "./gallery.controller"

import { authMiddleware } from "../../middlewares/auth.middleware"
import { rbacMiddleware } from "../../middlewares/rbac.middleware"

import { uploadImage } from "../../middlewares/upload.middleware"

const router = Router()

router.get("/", GalleryController.findAll)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  uploadImage.array("images", 10),
  GalleryController.create
)

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  GalleryController.delete
)

export default router