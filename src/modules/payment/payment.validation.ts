import { z } from "zod"

export const createTransactionSchema = z.object({
  donorName: z.string().trim().min(3),
  donorEmail: z.string().trim().email(),
  phone: z.string().trim().optional(),
  amount: z.number().positive(),
  categoryId: z.number().int().positive(),
  campaignId: z.number().int().positive().optional(),
})


export const refundSchema =
  z.object({
    reason:
      z.string()
       .min(5)
       .max(255),

    amount:
      z.number()
       .positive()
       .optional()
  })

export type RefundInput =
  z.infer<
    typeof refundSchema
  >

export type CreateTransactionInput = z.infer<
  typeof createTransactionSchema
>
