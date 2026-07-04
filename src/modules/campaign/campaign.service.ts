// campaign.service.ts

import * as repo from './campaign.repository'

import {
  CampaignStatus,
} from '../../generated/client'

import type {
  CampaignProgress,
  CreateCampaignInput,
  UpdateCampaignInput,
} from './campaign.type'

export type PaginatedResponse<T> = {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export const getCampaigns = async ({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number
  limit?: number
  status?: CampaignStatus
}): Promise<PaginatedResponse<Awaited<ReturnType<typeof repo.findCampaigns>>[number]>> => {

  const [data, total] = await Promise.all([
    repo.findCampaigns({
      page,
      limit,
      status,
    }),

    repo.countCampaigns(status),
  ])

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

export const getCampaignById = async (
  id: number
) => {
  return await repo.findCampaignById(id)
}

export const addCampaign = async (
  data: CreateCampaignInput,
  userId: number
) => {
  return await repo.createCampaign({
    ...data,
    targetAmount: data.targetAmount,
    createdBy: userId,
  })
}

export const editCampaign = async (
  id: number,
  data: UpdateCampaignInput
) => {
  return await repo.updateCampaign(id, data)
}

export const removeCampaign = async (
  id: number
) => {
  return await repo.deleteCampaign(id)
}

export const getCampaignProgress = async (
  campaignId: number
): Promise<CampaignProgress | null> => {

  const result = await repo.findCampaignProgress(
    campaignId
  )

  if (!result) {
    return null
  }

  const {
    campaign,
    donations,
  } = result

  const collectedAmount = donations.reduce(
    (total, donation) => {
      return total + donation.amount.toNumber()
    },
    0
  )

  const targetAmount =
    campaign.targetAmount.toNumber()

  const percentage =
    targetAmount > 0
      ? Math.min(
          100,
          Number(
            (
              (collectedAmount / targetAmount) * 100
            ).toFixed(2)
          )
        )
      : 0

  return {
    campaignId: campaign.id,
    title: campaign.title,
    targetAmount,
    collectedAmount,
    percentage,
    donorCount: donations.length,
    remainingAmount:
      targetAmount - collectedAmount,

    recentDonations: donations.map(
      (donation) => ({
        id: donation.id,
        donorName: donation.donorName,
        amount: donation.amount.toNumber(),
        createdAt: donation.createdAt,
      })
    ),
  }
}