import prisma from "../../database"
import type { UpdateMosqueProfileData } from "./mosque-profile.type"

export const MosqueProfileRepository = {
  async find() {
    return prisma.mosqueProfile.findFirst()
  },

  async findPublicConfig() {
  return prisma.mosqueProfile.findFirst({
    select: {
      defaultLanguage: true,
      timezone: true,

      donationEnabled: true,
      campaignEnabled: true,
      eventEnabled: true,
      inventoryEnabled: true,
      prayerEnabled: true,
    },
  })
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