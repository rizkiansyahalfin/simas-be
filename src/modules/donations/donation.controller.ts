import type { Request, Response } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { DonationService } from './donation.service'
import { createDonationSchema, rejectDonationSchema, donationQuerySchema } from './donation.validation'

export const getDonations = asyncHandler(async (
  req: Request,
  res: Response
) => {
    const validated = donationQuerySchema.parse({
      status: req.query.status,
      categoryId:
      req.query.categoryId
      ? Number(req.query.categoryId)
      : undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: typeof req.query.search === "string" ? req.query.search : undefined
    })

    const result = await DonationService.getAll(validated)

    res.json({
      status: 'success',
      data: result,
    })
})

export const getDonationStats =
  asyncHandler(async (
    _req: Request,
    res: Response
  ) => {

      const data =
        await DonationService.getPublicStats()

      res.json({
        status: "success",
        data
      })
  })

export const getDonationCertificate = asyncHandler(async (
  req: Request,
  res: Response
) => {
    const id = Number(req.params.id)

    if (Number.isNaN(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid donation ID'
      })
    }

    const pdf = await DonationService.generateDonationCertificate(id)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="donation-certificate-${id}.pdf"`
    )

    return res.send(pdf)
})

export const submitDonation = asyncHandler(async (
  req: Request,
  res: Response
) => {
    const validated = createDonationSchema.parse({
      ...req.body,
    })

    const result = await DonationService.submit(validated, req.file)

    res.status(201).json({
      status: 'success',
      data: result,
    })
})

export const verifyDonation = asyncHandler(async (
  req: Request,
  res: Response
) => {
    const id = Number(req.params.id)
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    await DonationService.verify(id, userId)

    res.json({
      status: 'success',
      message: 'Donation verified',
    })
})

export const rejectDonation = asyncHandler(async (
  req: Request,
  res: Response
) => {
    const id = Number(req.params.id)
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const validated = rejectDonationSchema.parse(req.body)

    await DonationService.reject(id, userId, validated.note)

    res.json({
      status: 'success',
      message: 'Donation rejected',
    })
})