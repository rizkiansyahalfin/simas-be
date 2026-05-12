import { Router } from "express";
import { AuthController } from "./auth.controller";
import { bruteForceMiddleware } from "../../middleware/brute-force.middleware";
const router = Router();
router.post("/login", bruteForceMiddleware, AuthController.login);
export default router;
