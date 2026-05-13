import { z } from "zod";
export const createDistributionSchema = z.object({
    mustahikId: z.number().int().positive(),
    zisTransactionId: z.number().int().positive(),
    amount: z.number().positive(),
    description: z.string().optional(),
    distributionDate: z.string().datetime()
});
export const distributionQuerySchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10)
});
