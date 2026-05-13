import { congregationQuerySchema, createCongregationSchema, updateCongregationSchema } from "./congregation.validation";
import { CongregationService } from "./congregation.service";
export const CongregationController = {
    async getAll(req, res, next) {
        try {
            const query = congregationQuerySchema.parse(req.query);
            const result = await CongregationService.getAll(query);
            res.json({
                status: "success",
                data: result
            });
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validated = createCongregationSchema.parse(req.body);
            const result = await CongregationService.create(validated);
            res.status(201).json({
                status: "success",
                data: result
            });
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid congregation ID"
                });
            }
            const validated = updateCongregationSchema.parse(req.body);
            const result = await CongregationService.update(id, validated);
            res.json({
                status: "success",
                data: result
            });
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid congregation ID"
                });
            }
            await CongregationService.delete(id);
            res.json({
                status: "success",
                message: "Congregation deleted successfully"
            });
        }
        catch (err) {
            next(err);
        }
    }
};
