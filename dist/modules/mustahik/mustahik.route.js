import { Router } from "express";
import { MustahikController } from "./mustahik.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
const router = Router();
router.get("/", MustahikController.getAll);
router.post("/", authMiddleware, rbacMiddleware("superadmin", "bendahara"), MustahikController.create);
router.put("/:id", authMiddleware, rbacMiddleware("superadmin", "bendahara"), MustahikController.update);
export default router;
