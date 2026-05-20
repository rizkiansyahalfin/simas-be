import { GalleryRepository } from "./gallery.repository"
import type { CreateGalleryBody, CreateGalleryPayload } from "./gallery.type"

export const GalleryService = {
  async getAll() {
    return GalleryRepository.findAll()
  },

  async create(
    files: Express.Multer.File[],
    body: CreateGalleryBody,
    userId: number
  ) {
    const payload: CreateGalleryPayload[] = files.map((file, index) => ({
      title: body.titles?.[index] ?? null,
      caption: body.captions?.[index] ?? null,
      imageUrl: file.path,
      uploadedBy: userId
    }))

    return GalleryRepository.createMany(payload)
  },

  async remove(id: number) {
    return GalleryRepository.delete(id)
  }
}