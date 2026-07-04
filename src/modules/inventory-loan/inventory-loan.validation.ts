import { z } from "zod"

const parseDate = z.preprocess((value) => {
  if (typeof value === "string" || value instanceof Date) {
    const date = new Date(value)
    return isNaN(date.getTime()) ? value : date
  }
  return value
}, z.date())

export const createInventoryLoanSchema = z.object({
  inventoryId: z.number().int().positive(),
  borrowerName: z.string().trim().min(3).max(100),
  borrowerPhone: z.string().trim().max(20).optional(),
  loanDate: parseDate,
  expectedReturnDate: parseDate,
  notes: z.string().optional()
})

export const updateInventoryLoanSchema = z.object({
  borrowerName: z.string().trim().min(3).max(100).optional(),
  borrowerPhone: z.string().trim().max(20).optional(),
  loanDate: parseDate.optional(),
  expectedReturnDate: parseDate.optional(),
  notes: z.string().optional()
})

export const returnInventorySchema = z.object({
  actualReturnDate: parseDate.optional(),
  notes: z.string().optional(),
  condition: z.enum(["baik", "rusak_ringan", "rusak_berat", "hilang"]).optional()
})

export const loanQuerySchema = z.object({
  status: z.enum(["borrowed", "returned", "overdue"]).optional(),
  borrowerName: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
})

export type CreateInventoryLoanInput = z.infer<typeof createInventoryLoanSchema>
export type UpdateInventoryLoanInput = z.infer<typeof updateInventoryLoanSchema>
export type ReturnInventoryInput = z.infer<typeof returnInventorySchema>
export type LoanQueryInput = z.infer<typeof loanQuerySchema>