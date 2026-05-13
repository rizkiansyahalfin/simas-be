import { InventoryService } from './inventory.service';
import { CreateInventorySchema, UpdateInventorySchema, FilterInventorySchema } from './inventory.validation';
export const InventoryController = {
    async getAll(req, res, next) {
        try {
            const filter = FilterInventorySchema.parse(req.query);
            const data = await InventoryService.getAll(filter);
            res.json({
                status: 'success',
                data
            });
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid inventory ID'
                });
            }
            const data = await InventoryService.getById(id);
            res.json({
                status: 'success',
                data
            });
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validated = CreateInventorySchema.parse(req.body);
            const data = await InventoryService.create(validated);
            res.status(201).json({
                status: 'success',
                data
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
                    status: 'error',
                    message: 'Invalid inventory ID'
                });
            }
            const validated = UpdateInventorySchema.parse(req.body);
            const data = await InventoryService.update(id, validated);
            res.json({
                status: 'success',
                data
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
                    status: 'error',
                    message: 'Invalid inventory ID'
                });
            }
            await InventoryService.delete(id);
            res.json({
                status: 'success',
                message: 'Inventory item deleted successfully'
            });
        }
        catch (err) {
            next(err);
        }
    }
};
