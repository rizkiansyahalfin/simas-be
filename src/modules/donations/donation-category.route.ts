import { Router } from "express"

import * as controller
from "./donation-category.controller"

import {
  authMiddleware
} from "../../middlewares/auth.middleware"

import {
  rbacMiddleware
} from "../../middlewares/rbac.middleware"

const router = Router()

router.get(
  "/",
  controller.getDonationCategories
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware(
    "bendahara",
    "superadmin"
  ),
  controller.createDonationCategory
)

export default router