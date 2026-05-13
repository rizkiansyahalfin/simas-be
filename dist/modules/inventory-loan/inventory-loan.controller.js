import { loanQuerySchema, createInventoryLoanSchema, updateInventoryLoanSchema, returnInventorySchema } from "./inventory-loan.validation";
import { InventoryLoanService } from "./inventory-loan.service";
export const InventoryLoanController = {
    async getAll(req, res, next) {
        try {
            const query = loanQuerySchema.parse(req.query);
            const result = await InventoryLoanService.getAll(query);
            res.json({
                status: "success",
                data: result
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
                    status: "error",
                    message: "Invalid loan ID"
                });
            }
            const result = await InventoryLoanService.getById(id);
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
            const validated = createInventoryLoanSchema.parse(req.body);
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "User not authenticated"
                });
            }
            const result = await InventoryLoanService.create({
                ...validated,
                createdBy: userId
            });
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
                    message: "Invalid loan ID"
                });
            }
            const validated = updateInventoryLoanSchema.parse(req.body);
            const result = await InventoryLoanService.update(id, validated);
            res.json({
                status: "success",
                data: result
            });
        }
        catch (err) {
            next(err);
        }
    },
    async returnLoan(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid loan ID"
                });
            }
            const validated = returnInventorySchema.parse(req.body);
            const result = await InventoryLoanService.returnLoan(id, validated);
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
                    message: "Invalid loan ID"
                });
            }
            await InventoryLoanService.delete(id);
            res.json({
                status: "success",
                message: "Loan deleted successfully"
            });
        }
        catch (err) {
            next(err);
        }
    }
};
