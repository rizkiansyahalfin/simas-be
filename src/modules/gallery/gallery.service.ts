import { GalleryRepository } from "./gallery.repository"
import type { CreateGalleryBody, CreateGalleryPayload } from "./gallery.type"

export const GalleryService = {
async getAll(params: {
  page?: number | string
  limit?: number | string
  search?: string
}) {
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 10
  const search = params.search??""
  const { data, total } = await GalleryRepository.findAll({
    page,
    limit,
    search
  })
  
  return {
    data,
    meta: {
      page,
      limit,
      search,
      total,
      totalPage: Math.ceil(total / limit)
    }
  }
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