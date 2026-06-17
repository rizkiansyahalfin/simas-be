import { z } from "zod"

export const createGallerySchema = z.object({
  titles: z.union([z.string(),z.array(z.string())]).optional(),
  captions: z.array(z.string().optional()).optional()
})

export type CreateGalleryInput = z.infer<typeof createGallerySchema>
