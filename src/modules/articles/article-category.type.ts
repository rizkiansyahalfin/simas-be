import { z } from "zod"
import {
  createArticleCategorySchema,
  updateArticleCategorySchema
} from "./article-category.validation"

export type CreateArticleCategoryInput =
  z.infer<typeof createArticleCategorySchema>

export type UpdateArticleCategoryInput =
  z.infer<typeof updateArticleCategorySchema>