import { PrayerService } from "./prayer.service";
import { prayerConfigSchema, prayerQuerySchema } from "./prayer.validation";
export const PrayerController = {
    async getPrayer(req, res, next) {
        try {
            const query = prayerQuerySchema.parse(req.query);
            const data = await PrayerService.getPrayer(query.date, query.city);
            if (!data) {
                return res.status(404).json({
                    status: "error",
                    message: "Prayer schedule not found"
                });
            }
            res.json({
                status: "success",
                data
            });
        }
        catch (err) {
            next(err);
        }
    },
    async updateConfig(req, res, next) {
        try {
            const payload = prayerConfigSchema.parse(req.body);
            const config = await PrayerService.updateConfig(payload);
            res.json({
                status: "success",
                data: config
            });
        }
        catch (err) {
            next(err);
        }
    }
};
