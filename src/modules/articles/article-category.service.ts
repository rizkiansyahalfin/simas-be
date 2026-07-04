import { sanitizeInput }
from "../../utils/sanitize"

import {
  ArticleCategoryRepository
} from "./article-category.repository"

import type {
  CreateArticleCategoryInput,
  UpdateArticleCategoryInput
} from "./article-category.type"

export const ArticleCategoryService = {

  async getAll() {
    return ArticleCategoryRepository.findAll()
  },

  async create(
    data: CreateArticleCategoryInput
  ) {

    return ArticleCategoryRepository.create({
      name: sanitizeInput(data.name),
      slug: sanitizeInput(data.slug)
    })
  },

  async update(
    id: number,
    data: UpdateArticleCategoryInput
  ) {

    const existing =
      await ArticleCategoryRepository.findById(id)

    if (!existing) {
      throw new Error("CATEGORY_NOT_FOUND")
    }

    return ArticleCategoryRepository.update(
      id,
      {
        name: data.name
          ? sanitizeInput(data.name)
          : undefined,

        slug: data.slug
          ? sanitizeInput(data.slug)
          : undefined
      }
    )
  },

  async delete(id: number) {

    const existing =
      await ArticleCategoryRepository.findById(id)

    if (!existing) {
      throw new Error("CATEGORY_NOT_FOUND")
    }

    return ArticleCategoryRepository.delete(id)
  }
}