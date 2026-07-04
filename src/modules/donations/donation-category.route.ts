import { Router } from "express"

import * as controller
from "./donation-category.controller"
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
  asyncHandler(controller.getDonationCategories)
)

router.post(
  "/",
  authMiddleware,
  rbacMiddleware(
    "bendahara",
    "superadmin"
  ),
  asyncHandler(controller.createDonationCategory)
)

export default router