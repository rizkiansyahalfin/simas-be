import { z } from "zod"

export const createTransactionSchema = z.object({
  donorName: z.string().trim().min(3),
  donorEmail: z.string().trim().email(),
  phone: z.string().trim().optional(),
  amount: z.number().positive(),
  categoryId: z.number().int().positive(),
  campaignId: z.number().int().positive().optional(),
})

export type CreateTransactionInput = z.infer<
  typeof createTransactionSchema
>
