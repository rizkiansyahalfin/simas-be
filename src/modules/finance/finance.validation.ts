import { z } from 'zod';

export const createCashSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive(),
  category: z.string().max(100),
  description: z.string().optional(),
  transactionDate: z.string().transform((str) => new Date(str)),
});

export type CreateCashInput = z.infer<typeof createCashSchema>;