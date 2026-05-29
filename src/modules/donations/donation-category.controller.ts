import type {
  Request,
  Response,
  NextFunction
} from "express"

import { z } from "zod"

import {
  DonationCategoryService
} from "./donation-category.service"

const createSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional()
})

export const getDonationCategories =
  async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const data =
        await DonationCategoryService.getAll()

      res.json({
        status: "success",
        data
      })

    } catch (err) {
      next(err)
    }
  }

export const createDonationCategory =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const validated =
        createSchema.parse(req.body)

      const data =
        await DonationCategoryService.create(
          validated
        )

      res.status(201).json({
        status: "success",
        data
      })

    } catch (err) {
      next(err)
    }
  }