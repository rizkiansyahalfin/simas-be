import { z } from "zod"

export const createArticleCategorySchema =
  z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(120)
  })

export const updateArticleCategorySchema =
  createArticleCategorySchema.partial()