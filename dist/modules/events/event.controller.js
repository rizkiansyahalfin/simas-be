import { EventService } from "./event.service";
import { createEventSchema, updateEventSchema, updateStatusSchema } from "./event.validation";
export const EventController = {
    async getAll(req, res, next) {
        try {
            const status = req.query.status;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const params = {
                status,
                page,
                limit
            };
            const result = await EventService.getAll(params);
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
            const validated = createEventSchema.parse(req.body);
            if (!req.user?.id) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized"
                });
            }
            const result = await EventService.create(validated, req.user.id);
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
                    message: "Invalid event ID"
                });
            }
            const validated = updateEventSchema.parse(req.body);
            const result = await EventService.update(id, validated);
            res.json({
                status: "success",
                data: result
            });
        }
        catch (err) {
            next(err);
        }
    },
    async updateStatus(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid event ID"
                });
            }
            const { status } = updateStatusSchema.parse(req.body);
            const result = await EventService.updateStatus(id, status);
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
                    message: "Invalid event ID"
                });
            }
            await EventService.delete(id);
            res.json({
                status: "success",
                message: "Event deleted successfully"
            });
        }
        catch (err) {
            next(err);
        }
    }
};
