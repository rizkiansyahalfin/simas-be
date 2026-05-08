import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { rbacMiddleware } from '../../middleware/rbac.middleware';
import { uploadDonationProof } from '../../middleware/upload.middleware';
import * as controller from './donation.controller';
const router = Router();
// PUBLIC
router.post('/', uploadDonationProof.single('proof'), controller.submitDonation);
// ADMIN
router.get('/', authMiddleware, rbacMiddleware('bendahara', 'superadmin'), controller.getDonations);
router.put('/:id/verify', authMiddleware, rbacMiddleware('bendahara', 'superadmin'), controller.verifyDonation);
router.put('/:id/reject', authMiddleware, rbacMiddleware('bendahara', 'superadmin'), controller.rejectDonation);
export default router;
