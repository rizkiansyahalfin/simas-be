import { z } from 'zod';
const transactionTypeEnum = z.enum(['income', 'expense']);
const zisCategoryEnum = z.enum(['zakat', 'infaq', 'shadaqah']);
const parseDate = z.preprocess((value) => {
    if (typeof value === 'string' || value instanceof Date) {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date;
    }
    return value;
}, z.date());
export const createCashSchema = z.object({
    type: z.preprocess((value) => typeof value === 'string' ? value.toLowerCase() : value, transactionTypeEnum),
    amount: z.number().positive(),
    category: z.string().max(100),
    description: z.string().optional(),
    transactionDate: parseDate,
});
export const updateCashSchema = createCashSchema.partial();
export const createZisSchema = z.object({
    type: z.preprocess((value) => typeof value === 'string' ? value.toLowerCase() : value, transactionTypeEnum),
    zisCategory: z.preprocess((value) => typeof value === 'string' ? value.toLowerCase() : value, zisCategoryEnum),
    amount: z.number().positive(),
    muzakkiName: z.string().max(100).optional(),
    description: z.string().optional(),
    transactionDate: parseDate,
});
export const updateZisSchema = createZisSchema.partial();
