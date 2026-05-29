import { sanitizeInput } from "../../utils/sanitize"
import { InventoryCategoryRepository } from "./inventory-category.repository"
import type {
  CreateInventoryCategoryInput,
  UpdateInventoryCategoryInput,
} from "./inventory-category.type"

export const InventoryCategoryService = {
  async getAll() {
    return InventoryCategoryRepository.findAll()
  },

  async create(data: CreateInventoryCategoryInput) {
    return InventoryCategoryRepository.create({
      name: sanitizeInput(data.name)
    })
  },

  async update(id: number, data: UpdateInventoryCategoryInput) {
    const existing = await InventoryCategoryRepository.findById(id)

    if (!existing) {
      throw new Error("CATEGORY_NOT_FOUND")
    }

    return InventoryCategoryRepository.update(id, {
      name: data.name ? sanitizeInput(data.name) : undefined
    })
  },

  async delete(id: number) {
    const existing = await InventoryCategoryRepository.findById(id)

    if (!existing) {
      throw new Error("CATEGORY_NOT_FOUND")
    }

    return InventoryCategoryRepository.delete(id)
  }
}
