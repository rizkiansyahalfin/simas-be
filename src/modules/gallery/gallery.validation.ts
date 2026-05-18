import { z } from "zod"

export const createGallerySchema = z.object({
  titles: z.array(z.string().optional()).optional(),
  captions: z.array(z.string().optional()).optional()
})

export type CreateGalleryInput = z.infer<typeof createGallerySchema>
