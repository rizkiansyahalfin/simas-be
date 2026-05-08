import { Router } from 'express'
import { DonationController } from './donation.controller'

const router = Router()

router.get('/', DonationController.findAll)
router.get('/:id', DonationController.findById)
router.post('/', DonationController.create)
router.patch('/:id/verify', DonationController.verify)

export default router