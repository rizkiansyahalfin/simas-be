import type { Request, Response, NextFunction } from 'express'
import { DonationService } from './donation.service'
import { createDonationSchema, rejectDonationSchema, donationQuerySchema } from './donation.validation'

export const getDonations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(err)
  }
}

export const getDonationStats =
  async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const data =
        await DonationService.getPublicStats()

      res.json({
        status: "success",
        data
      })

    } catch (err) {
      next(err)
    }
  }

export const submitDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = createDonationSchema.parse({
      ...req.body,
      amount: Number(req.body.amount),
    })

    const result = await DonationService.submit(validated, req.file)

    res.status(201).json({
      status: 'success',
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

export const verifyDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(err)
  }
}

export const rejectDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err) {
    next(err)
  }
}