import prisma from "../../database"
import { Prisma } from "../../generated/client"


export const ArticleRepository = {
  findAll(categorySlug?: string) {

  return prisma.article.findMany({

    where: {
      isPublished: true,

      ...(categorySlug && {
        category: {
          slug: categorySlug
        }
      })
    },

    include: {
      author: true,
      category: true
    },

    orderBy: {
      createdAt: "desc"
    }
  })
},

  findById(id: number) {
    return prisma.article.findUnique({
      where: { id }
    })
  },


  create(data: Prisma.ArticleCreateInput) {
    return prisma.article.create({ data })
  },

  update(id: number, data: Prisma.ArticleUpdateInput) {
    return prisma.article.update({
      where: { id },
      data
    })
  },

  delete(id: number) {
    return prisma.article.delete({
      where: { id }
    })
  }
}