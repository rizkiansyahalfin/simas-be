import { ArticleRepository } from "./article.repository"
import type { CreateArticleInput, UpdateArticleInput } from "./article.type"
import type { AuthUser } from "../../modules/auth/auth.type"

export const ArticleService = {
  async findAll() {
    return ArticleRepository.findAll()
  },

  async create(data: CreateArticleInput, userId: number) {
    return ArticleRepository.create({
      ...data,
      author: { connect: { id: userId } }
    })
  },

  async update(id: number, data: UpdateArticleInput, user: AuthUser) {
    const article = await ArticleRepository.findById(id)
    if (!article) throw new Error("NOT_FOUND")

    if (article.authorId !== user.id && user.role !== "superadmin") {
      throw new Error("FORBIDDEN")
    }

    return ArticleRepository.update(id, data)
  },

  async publish(id: number, user: AuthUser) {
    const article = await ArticleRepository.findById(id)
    if (!article) throw new Error("NOT_FOUND")
    if (user.role !== "superadmin") throw new Error("FORBIDDEN")

    return ArticleRepository.update(id, {
      isPublished: true,
      publishedAt: new Date()
    })
  },

  async delete(id: number, user: AuthUser) {
    const article = await ArticleRepository.findById(id)
    if (!article) throw new Error("NOT_FOUND")
    if (user.role !== "superadmin") throw new Error("FORBIDDEN")

    return ArticleRepository.delete(id)
  }
}
