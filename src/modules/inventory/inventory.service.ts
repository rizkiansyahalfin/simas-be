import { InventoryRepository } from './inventory.repository'
import type { FilterInventoryInput, CreateInventoryInput, UpdateInventoryInput } from './inventory.validation'

export const InventoryService = {
  async getAll(filter: FilterInventoryInput) {
    const skip = Math.max((filter.page - 1) * filter.limit, 0)

    return InventoryRepository.findAll({
      condition: filter.condition,
      categoryId: filter.categoryId,
      search: filter.search,
      skip,
      limit: filter.limit
    })
  },

  async getById(id: number) {
    const item = await InventoryRepository.findById(id)

    if (!item) {
      throw new Error('INVENTORY_NOT_FOUND')
    }

    return item
  },

  async create(data: CreateInventoryInput) {
    return InventoryRepository.create(data)
  },

  async update(id: number, data: UpdateInventoryInput) {
    const item = await InventoryRepository.findById(id)

    if (!item) {
      throw new Error('INVENTORY_NOT_FOUND')
    }

    return InventoryRepository.update(id, data)
  },

  async delete(id: number) {
    const item = await InventoryRepository.findById(id)

    if (!item) {
      throw new Error('INVENTORY_NOT_FOUND')
    }

    // Check if item has active loans
    if (item.inventoryLoans && item.inventoryLoans.length > 0) {
      const hasActiveLoan = item.inventoryLoans.some(loan => loan.status !== 'returned')
      if (hasActiveLoan) {
        throw new Error('CANNOT_DELETE_INVENTORY_WITH_ACTIVE_LOANS')
      }
    }

    return InventoryRepository.delete(id)
  }
}