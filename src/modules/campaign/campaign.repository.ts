// campaign.repository.ts

import prisma from '../../database'

import {
  CampaignStatus,
  DonationStatus,
} from '../../generated/client'

import type {
  Prisma,
} from '../../generated/client'

type FindCampaignOptions = {
  page: number
  limit: number
  status?: CampaignStatus
}

export const findCampaigns = async ({
  page,
  limit,
  status,
}: FindCampaignOptions) => {
  const where: Prisma.CampaignWhereInput = {}

  if (status) {
    where.status = status
  }

  return await prisma.campaign.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const countCampaigns = async (
  status?: CampaignStatus
) => {
  const where: Prisma.CampaignWhereInput = {}

  if (status) {
    where.status = status
  }

  return await prisma.campaign.count({
    where,
  })
}

export const findCampaignById = async (
  id: number
) => {
  return await prisma.campaign.findUnique({
    where: {
      id,
    },
  })
}

export const createCampaign = async (
  data: Prisma.CampaignUncheckedCreateInput
) => {
  return await prisma.campaign.create({
    data,
  })
}

export const updateCampaign = async (
  id: number,
  data: Prisma.CampaignUpdateInput
) => {
  return await prisma.campaign.update({
    where: {
      id,
    },
    data,
  })
}

export const deleteCampaign = async (
  id: number
) => {
  return await prisma.campaign.delete({
    where: {
      id,
    },
  })
}

export const findCampaignProgress = async (
  campaignId: number
) => {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  })

  if (!campaign) {
    return null
  }

  const donations = await prisma.donation.findMany({
    where: {
      campaignId,
      status: DonationStatus.verified,
    },
    select: {
      id: true,
      donorName: true,
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    campaign,
    donations,
  }
}