import type {
  Request,
  Response
} from "express"

import { z } from "zod"
import { asyncHandler } from "../../utils/async-handler"

import {
  DonationCategoryService
} from "./donation-category.service"

const createSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional()
})

export const getDonationCategories =
  asyncHandler(async (
    _req: Request,
    res: Response
  ) => {
      const data =
        await DonationCategoryService.getAll()

      res.json({
        status: "success",
        data
      })
  })

export const createDonationCategory =
  asyncHandler(async (
    req: Request,
    res: Response
  ) => {
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
  })