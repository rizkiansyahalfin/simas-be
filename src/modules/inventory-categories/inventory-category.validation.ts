import { z } from "zod"

export const createInventoryCategorySchema = z.object({
  name: z.string().trim().min(1).max(100)
})

export const updateInventoryCategorySchema = z.object({
  name: z.string().trim().min(1).max(100).optional()
})
