import { z } from 'zod'
import { CampaignStatus } from '../../generated/client'

export const createCampaignSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().optional(),
  targetAmount: z.preprocess((value) => {
    if (typeof value === 'string') {
      return Number(value)
    }
    return value
  }, z.number().positive()),
  thumbnailUrl: z.string().url().optional(),
  deadline: z.preprocess((value) => {
    if (typeof value === 'string') {
      const parsed = new Date(value)
      return Number.isNaN(parsed.getTime()) ? undefined : parsed
    }
    return value
  }, z.date().optional()),
  status: z.nativeEnum(CampaignStatus).optional()
})

export const updateCampaignSchema = createCampaignSchema.partial()

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>
