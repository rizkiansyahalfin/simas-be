// campaign.route.ts

import { Router } from 'express'
import { AuditAction } from '../../generated/client'

import * as campaignController from './campaign.controller'

import {
  authMiddleware,
} from '../../middlewares/auth.middleware'

import {
  rbacMiddleware,
} from '../../middlewares/rbac.middleware'

import { auditMiddleware } from '../audit/audit.middleware'

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
  auditMiddleware({
    action: AuditAction.create,
    module: 'campaigns',
  }),
  campaignController.createCampaign
)

router.put(
  '/:id',
  authMiddleware,
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  auditMiddleware({
    action: AuditAction.update,
    module: 'campaigns',
  }),
  campaignController.updateCampaign
)

router.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware(
    Role.superadmin
  ),
  auditMiddleware({
    action: AuditAction.delete,
    module: 'campaigns',
  }),
  campaignController.deleteCampaign
)

export default router