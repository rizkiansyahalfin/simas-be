import prisma from '../../database';
export const InventoryRepository = {
    async findAll(filter) {
        const whereClause = {};
        if (filter.condition) {
            whereClause.condition = filter.condition;
        }
        if (filter.category) {
            whereClause.category = {
                contains: filter.category,
                mode: 'insensitive'
            };
        }
        if (filter.search) {
            whereClause.OR = [
                { itemName: { contains: filter.search, mode: 'insensitive' } },
                { itemCode: { contains: filter.search, mode: 'insensitive' } }
            ];
        }
        const [data, total] = await Promise.all([
            prisma.inventory.findMany({
                where: whereClause,
                include: {
                    manager: { select: { id: true, username: true, email: true } },
                    inventoryLoans: {
                        select: {
                            id: true,
                            borrowerName: true,
                            loanDate: true,
                            expectedReturnDate: true,
                            actualReturnDate: true,
                            status: true
                        },
                        where: { status: { not: 'returned' } }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: filter.skip,
                take: filter.limit
            }),
            prisma.inventory.count({ where: whereClause })
        ]);
        return {
            data,
            meta: {
                total,
                page: Math.floor(filter.skip / filter.limit) + 1,
                limit: filter.limit,
                totalPages: Math.ceil(total / filter.limit)
            }
        };
    },
    async findById(id) {
        return prisma.inventory.findUnique({
            where: { id },
            include: {
                manager: { select: { id: true, username: true, email: true } },
                inventoryLoans: {
                    select: {
                        id: true,
                        borrowerName: true,
                        loanDate: true,
                        expectedReturnDate: true,
                        actualReturnDate: true,
                        status: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
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
                managedBy: data.managedBy
            },
            include: {
                manager: { select: { id: true, username: true, email: true } }
            }
        });
    },
    async update(id, data) {
        return prisma.inventory.update({
            where: { id },
            data,
            include: {
                manager: { select: { id: true, username: true, email: true } },
                inventoryLoans: { select: { id: true } }
            }
        });
    },
    async delete(id) {
        return prisma.inventory.delete({ where: { id } });
    }
};
