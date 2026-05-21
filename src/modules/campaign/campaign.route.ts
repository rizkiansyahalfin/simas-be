// campaign.route.ts

import { Router } from 'express'

import * as campaignController from './campaign.controller'

import {
  authMiddleware,
} from '../../middlewares/auth.middleware'

import {
  rbacMiddleware,
} from '../../middlewares/rbac.middleware'

import {
  Role,
} from '../../generated/enums'

const router = Router()

// Public
router.get(
  '/',
  campaignController.getCampaigns
)

router.get(
  '/:id',
  campaignController.getCampaignById
)

router.get(
  '/:id/progress',
  campaignController.getCampaignProgress
)

// Protected
router.post(
  '/',
  authMiddleware,
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  campaignController.createCampaign
)

router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  campaignController.updateCampaign
)

router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware(
    Role.superadmin
  ),
  campaignController.deleteCampaign
)

export default router