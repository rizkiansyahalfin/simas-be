import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { MosqueProfileService } from "./mosque-profile.service"
import { updateMosqueProfileSchema } from "./mosque-profile.validation"

export const MosqueProfileController = {
  get: asyncHandler(async (req: Request, res: Response) => {
    const data = await MosqueProfileService.getProfile()

    return res.json({
      success: true,
      data
    })
  }),

  getPublicConfig: asyncHandler(async (
  req: Request,
  res: Response
) => {

  const data =
    await MosqueProfileService.getPublicConfig()

  return res.json({
    success: true,
    data,
  })
}),

  update: asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateMosqueProfileSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: parsed.error.format()
      })
    }

    const data = await MosqueProfileService.update(
      parsed.data,
      req.file
    )

    return res.json({
      success: true,
      data
    })
  })
}