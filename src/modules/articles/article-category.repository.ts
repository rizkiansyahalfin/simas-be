import prisma from "../../database"

export const ArticleCategoryRepository = {

  findAll() {
    return prisma.articleCategory.findMany({
      orderBy: {
        name: "asc"
      }
    })
  },

  findById(id: number) {
    return prisma.articleCategory.findUnique({
      where: { id }
    })
  },

  create(data: {
    name: string
    slug: string
  }) {
    return prisma.articleCategory.create({
      data
    })
  },

  update(
    id: number,
    data: {
      name?: string
      slug?: string
    }
  ) {
    return prisma.articleCategory.update({
      where: { id },
      data
    })
  },

  delete(id: number) {
    return prisma.articleCategory.delete({
      where: { id }
    })
  }
}