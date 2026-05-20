import prisma from "../../database"
import type { Prisma } from "../../generated/client"

export const GalleryRepository = {
  async findAll() {
    return prisma.gallery.findMany({
      include: {
        uploader: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  },

  async findById(id: number) {
    return prisma.gallery.findUnique({
      where: { id }
    })
  },

  async createMany(data: Prisma.GalleryCreateManyInput[]) {
    return prisma.gallery.createMany({
      data
    })
  },

  async delete(id: number) {
    return prisma.gallery.delete({
      where: { id }
    })
  }
}