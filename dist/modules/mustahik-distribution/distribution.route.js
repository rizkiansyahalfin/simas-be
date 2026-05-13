import { Router } from "express";
import { DistributionController } from "./distribution.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
const router = Router();
router.get("/", authMiddleware, rbacMiddleware("superadmin", "bendahara"), DistributionController.getHistory);
router.post("/", authMiddleware, rbacMiddleware("superadmin", "bendahara"), DistributionController.create);
export default router;
