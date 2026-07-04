// campaign.type.ts

import type {
  Campaign,
  CampaignStatus,
} from '../../generated/client'

export type CreateCampaignInput = {
  title: string
  description?: string
  targetAmount: number
  thumbnailUrl?: string
  deadline?: Date
  status?: CampaignStatus
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>

export type CampaignListItem = Campaign

export type CampaignProgressDonation = {
  id: number
  donorName: string
  amount: number
  createdAt: Date
}

export type CampaignProgress = {
  campaignId: number
  title: string
  targetAmount: number
  collectedAmount: number
  percentage: number
  donorCount: number
  remainingAmount: number
  recentDonations: CampaignProgressDonation[]
}