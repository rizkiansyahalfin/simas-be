import type { Request, Response } from 'express'
import { DonationService } from './donation.service'
import { DonationRepository } from './donation.repository'
import { CreateDonationSchema, VerifyDonationSchema } from './donation.validation'

export const DonationController = {
  async create(req: Request, res: Response) {
    const parsed = CreateDonationSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      })
    }

    const donation = await DonationService.create(parsed.data)
    return res.status(201).json({ success: true, data: donation })
  },

  async verify(req: Request, res: Response) {
    const id = Number(req.params.id)
    const parsed = VerifyDonationSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      })
    }

    const donation = await DonationRepository.findById(id)
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donasi tidak ditemukan',
      })
    }

    const verifiedBy = (req as any).user?.id ?? 1
    const result = await DonationService.verify(id, verifiedBy, parsed.data)

    return res.status(200).json({ success: true, data: result })
  },

  async findAll(_req: Request, res: Response) {
    const data = await DonationService.findAll()
    return res.status(200).json({ success: true, data })
  },

  async findById(req: Request, res: Response) {
    const data = await DonationService.findById(Number(req.params.id))
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Donasi tidak ditemukan',
      })
    }
    return res.status(200).json({ success: true, data })
  },
}