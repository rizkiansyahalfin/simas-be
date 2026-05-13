import { Router } from "express";
import { PrayerController } from "./prayer.controller";
const router = Router();
router.get("/", PrayerController.getPrayer);
router.put("/config", PrayerController.updateConfig);
export default router;
