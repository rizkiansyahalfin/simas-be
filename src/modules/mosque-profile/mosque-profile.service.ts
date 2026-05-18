import { MosqueProfileRepository } from "./mosque-profile.repository"
import type { UpdateMosqueProfileData } from "./mosque-profile.type"

export const MosqueProfileService = {
  async getProfile() {
    return MosqueProfileRepository.find()
  },

  async update(
    data: UpdateMosqueProfileData,
    qrisImage?: Express.Multer.File
  ) {
    return MosqueProfileRepository.upsert({
      ...data,
      ...(qrisImage && {
        qrisImageUrl: qrisImage.path
      })
    })
  }
}