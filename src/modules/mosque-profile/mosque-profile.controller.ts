import type { Request, Response } from "express"
import { MosqueProfileService } from "./mosque-profile.service"
import { updateMosqueProfileSchema } from "./mosque-profile.validation"

export const MosqueProfileController = {
  async get(req: Request, res: Response) {
    const data = await MosqueProfileService.getProfile()

    return res.json({
      success: true,
      data
    })
  },

  async update(req: Request, res: Response) {
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
  }
}