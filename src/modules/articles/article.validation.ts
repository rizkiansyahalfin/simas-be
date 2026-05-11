import { z } from "zod"

const sanitizeOptionalUrl = z.preprocess((value) => {
  if (typeof value !== "string") return value
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}, z.string().url().optional())

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(255),
  content: z.string().trim().min(1),
  imageUrl: sanitizeOptionalUrl
})

export const updateArticleSchema = createArticleSchema.partial()

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
