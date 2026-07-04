import prisma from "../../database"
import type { Prisma } from "../../generated/client"

export const GalleryRepository = {
async findAll(params: {
  page?: number   |string
  limit?: number | string
  search?: string
}) {
 const page = Number(params.page) || 1
const limit = Number(params.limit) || 10
  const search = params.search ?? ""

  const skip = (page - 1) * limit

  const where: Prisma.GalleryWhereInput = search.trim()
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            caption: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      }
    : {}

  const [data, total] = await Promise.all([
    prisma.gallery.findMany({
      where,
      skip,
      take: limit,
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
    }),

    prisma.gallery.count({ where })
  ])

  return {
    data,
    total
  }
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