import type {
  Request,
  Response,
} from 'express'

import { asyncHandler } from '../../utils/async-handler'

import {
  CampaignStatus,
} from '../../generated/client'

import * as campaignService from './campaign.service'
import {
  createCampaignSchema,
  updateCampaignSchema,
} from './campaign.validation'

export const getCampaigns = asyncHandler(async (
  req: Request,
  res: Response
) => {

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const status =
    req.query.status as CampaignStatus | undefined

  const data =
    await campaignService.getCampaigns({
      page,
      limit,
      status,
    })

  return res.status(200).json({
    success: true,
    ...data,
  })
})

export const getCampaignById = asyncHandler(async (
  req: Request,
  res: Response
) => {

  const id = Number(req.params.id)

  const campaign =
    await campaignService.getCampaignById(id)

  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found',
    })
  }

  return res.status(200).json({
    success: true,
    data: campaign,
  })
})

export const createCampaign = asyncHandler(async (
  req: Request,
  res: Response
) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    })
  }

  const parsed = createCampaignSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid campaign payload',
      errors: parsed.error.format(),
    })
  }

  const campaign =
    await campaignService.addCampaign(
      parsed.data,
      req.user.id
    )

  return res.status(201).json({
    success: true,
    data: campaign,
  })
})

export const updateCampaign = asyncHandler(async (
  req: Request,
  res: Response
) => {

  const id = Number(req.params.id)

  const parsed = updateCampaignSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid campaign payload',
      errors: parsed.error.format(),
    })
  }

  const campaign =
    await campaignService.editCampaign(
      id,
      parsed.data
    )

  return res.status(200).json({
    success: true,
    data: campaign,
  })
})

export const deleteCampaign = asyncHandler(async (
  req: Request,
  res: Response
) => {

  const id = Number(req.params.id)

  await campaignService.removeCampaign(id)

  return res.status(200).json({
    success: true,
    message: 'Campaign deleted successfully',
  })
})

export const getCampaignProgress = asyncHandler(async (
  req: Request,
  res: Response
) => {

  const campaignId = Number(req.params.id)

  const progress =
    await campaignService.getCampaignProgress(
      campaignId
    )

  if (!progress) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found',
    })
  }

  return res.status(200).json({
    success: true,
    data: progress,
  })
})