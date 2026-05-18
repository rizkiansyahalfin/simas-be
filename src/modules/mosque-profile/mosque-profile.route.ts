import { Router } from "express"

import { MosqueProfileController }
from "./mosque-profile.controller"

import { authMiddleware }
from "../../middlewares/auth.middleware"

import { rbacMiddleware }
from "../../middlewares/rbac.middleware"

import { uploadImage }
from "../../middlewares/upload.middleware"

const router = Router()

router.get(
  "/",
  MosqueProfileController.get
)

router.put(
  "/",
  authMiddleware,
  rbacMiddleware(
    "superadmin",
    "admin_kegiatan"
  ),
  uploadImage.single("qris"),
  MosqueProfileController.update
)

export default router