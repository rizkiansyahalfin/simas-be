import prisma from "../../database"

export const DonationCategoryRepository = {

  async findAll() {
    return prisma.donationCategory.findMany({
      orderBy: {
        name: "asc"
      }
    })
  },

  async create(data: {
    name: string
    description?: string
  }) {

    return prisma.donationCategory.create({
      data
    })
  }
}