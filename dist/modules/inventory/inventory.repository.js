import prisma from '../../database';
export const InventoryRepository = {
    async findAll(filter) {
        return prisma.inventory.findMany({
            where: {
                ...(filter.condition && { condition: filter.condition }),
                ...(filter.category && {
                    category: { contains: filter.category, mode: 'insensitive' },
                }),
                ...(filter.search && {
                    OR: [
                        { itemName: { contains: filter.search, mode: 'insensitive' } },
                        { itemCode: { contains: filter.search, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: { createdAt: 'desc' },
            include: {
                manager: {
                    select: { id: true, username: true, email: true },
                },
            },
        });
    },
    async findById(id) {
        return prisma.inventory.findUnique({
            where: { id },
            include: {
                manager: {
                    select: { id: true, username: true, email: true },
                },
            },
        });
    },
    async create(data) {
        return prisma.inventory.create({
            data: {
                itemCode: data.itemCode,
                itemName: data.itemName,
                category: data.category,
                quantity: data.quantity,
                condition: data.condition,
                acquiredDate: data.acquiredDate,
                acquisitionCost: data.acquisitionCost,
                notes: data.notes,
                managedBy: data.managedBy,
            },
        });
    },
    async update(id, data) {
        return prisma.inventory.update({
            where: { id },
            data,
        });
    },
    async delete(id) {
        return prisma.inventory.delete({ where: { id } });
    },
};
