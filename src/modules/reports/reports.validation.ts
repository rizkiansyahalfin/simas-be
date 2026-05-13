import { z } from "zod"

export const monthlyFinanceQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000)
})

export type MonthlyFinanceQuery = z.infer<typeof monthlyFinanceQuerySchema>
