import { MosqueProfileRepository } from "./mosque-profile.repository"
import type { UpdateMosqueProfileData } from "./mosque-profile.type"

export const MosqueProfileService = {
  async getProfile() {
    return MosqueProfileRepository.find()
  },

  async getPublicConfig() {

  const profile =
    await MosqueProfileRepository.findPublicConfig()

  if (!profile) {

    return {
      defaultLanguage: "id",
      timezone: "Asia/Jakarta",

      features: {
        donation: true,
        campaign: true,
        events: true,
        inventory: true,
        prayerSchedule: true,
      },
    }
  }

  return {
    defaultLanguage:
      profile.defaultLanguage,

    timezone:
      profile.timezone,

    features: {
      donation:
        profile.donationEnabled,

      campaign:
        profile.campaignEnabled,

      events:
        profile.eventEnabled,

      inventory:
        profile.inventoryEnabled,

      prayerSchedule:
        profile.prayerEnabled,
    },
  }
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