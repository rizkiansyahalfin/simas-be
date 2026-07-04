import { Router } from 'express'
import { AuditAction } from '../../generated/client'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rbacMiddleware } from '../../middlewares/rbac.middleware'
import { auditMiddleware } from '../audit/audit.middleware'
import { uploadDonationProof } from '../../middlewares/upload.middleware'
import * as controller from './donation.controller'
import { asyncHandler } from '../../utils/async-handler'

const router = Router()

// PUBLIC
router.post('/', uploadDonationProof.single('proof'), asyncHandler(controller.submitDonation))

// ADMIN
router.get(
  '/',
  authMiddleware,
  rbacMiddleware('bendahara', 'superadmin'),
  asyncHandler(controller.getDonations)
)

router.get(
  '/:id/certificate',
  asyncHandler(controller.getDonationCertificate)
)

router.get(
  "/stats",
  asyncHandler(controller.getDonationStats)
)

router.put(
  '/:id/verify',
  authMiddleware,
  rbacMiddleware('bendahara', 'superadmin'),
  auditMiddleware({
    action: AuditAction.update,
    module: 'donations',
  }),
  asyncHandler(controller.verifyDonation)
)

router.put(
  '/:id/reject',
  authMiddleware,
  rbacMiddleware('bendahara', 'superadmin'),
  auditMiddleware({
    action: AuditAction.update,
    module: 'donations',
  }),
  asyncHandler(controller.rejectDonation)
)

export default router