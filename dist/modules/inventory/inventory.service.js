import { InventoryRepository } from './inventory.repository';
export const InventoryService = {
    async findAll(filter) {
        return InventoryRepository.findAll(filter);
    },
    async findById(id) {
        const item = await InventoryRepository.findById(id);
        if (!item)
            throw new Error('Item inventaris tidak ditemukan');
        return item;
    },
    async create(data) {
        return InventoryRepository.create(data);
    },
    async update(id, data) {
        await InventoryService.findById(id);
        return InventoryRepository.update(id, data);
    },
    async delete(id) {
        await InventoryService.findById(id);
        return InventoryRepository.delete(id);
    },
};
