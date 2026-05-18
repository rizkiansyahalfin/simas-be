import prisma from "../../database"
import type { UpdateMosqueProfileData } from "./mosque-profile.type"

export const MosqueProfileRepository = {
  async find() {
    return prisma.mosqueProfile.findFirst()
  },

  async upsert(data: UpdateMosqueProfileData) {
    return prisma.mosqueProfile.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data
      }
    })
  }
}