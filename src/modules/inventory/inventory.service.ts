import { InventoryRepository } from './inventory.repository'
import type { CreateInventoryInput, UpdateInventoryInput, FilterInventoryInput } from './inventory.validation'

export const InventoryService = {
  async findAll(filter: FilterInventoryInput) {
    return InventoryRepository.findAll(filter)
  },

  async findById(id: number) {
    const item = await InventoryRepository.findById(id)
    if (!item) throw new Error('Item inventaris tidak ditemukan')
    return item
  },

  async create(data: CreateInventoryInput) {
    return InventoryRepository.create(data)
  },

  async update(id: number, data: UpdateInventoryInput) {
    await InventoryService.findById(id)
    return InventoryRepository.update(id, data)
  },

  async delete(id: number) {
    await InventoryService.findById(id)
    return InventoryRepository.delete(id)
  },
}