import { Router } from 'express'
import { AuditAction } from '../../generated/client'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rbacMiddleware } from '../../middlewares/rbac.middleware'
import { auditMiddleware } from '../audit/audit.middleware'
import { uploadDonationProof } from '../../middlewares/upload.middleware'
import * as controller from './donation.controller'

const router = Router()

// PUBLIC
router.post('/', uploadDonationProof.single('proof'), controller.submitDonation)

// ADMIN
router.get(
  '/',
  authMiddleware,
  rbacMiddleware('bendahara', 'superadmin'),
  controller.getDonations
)

router.get(
  "/stats",
  controller.getDonationStats
)

router.put(
  '/:id/verify',
  authMiddleware,
  rbacMiddleware('bendahara', 'superadmin'),
  auditMiddleware({
    action: AuditAction.update,
    module: 'donations',
  }),
  controller.verifyDonation
)

router.put(
  '/:id/reject',
  authMiddleware,
  rbacMiddleware('bendahara', 'superadmin'),
  auditMiddleware({
    action: AuditAction.update,
    module: 'donations',
  }),
  controller.rejectDonation
)

export default router