import { Router } from "express"
import { AuthController } from "./auth.controller"
import { bruteForceMiddleware } from "../../middlewares/brute-force.middleware"

const router = Router()

router.post(
    "/login", 
    bruteForceMiddleware, 
    AuthController.login
  )

router.post(
  "/refresh",
  AuthController.refresh
  )


export default router