import type { Request, Response } from "express"
import { GalleryService } from "./gallery.service"
import { createGallerySchema } from "./gallery.validation"
import type { CreateGalleryBody } from "./gallery.type"

export const GalleryController = {
  async findAll(req: Request, res: Response) {
    const data = await GalleryService.getAll()

    return res.json({
      success: true,
      data
    })
  },

  async create(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[]
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const parsed = createGallerySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: parsed.error.format()
      })
    }

    const body = parsed.data as CreateGalleryBody
    const data = await GalleryService.create(files, body, userId)

    return res.status(201).json({
      success: true,
      data
    })
  },

  async delete(req: Request, res: Response) {
    await GalleryService.remove(Number(req.params.id))

    return res.json({
      success: true,
      message: "Gallery deleted"
    })
  }
}