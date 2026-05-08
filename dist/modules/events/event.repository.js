import prisma from "../../database";
export const EventRepository = {
    async findAll({ status, skip, limit }) {
        const whereClause = status ? { status: status } : {};
        const [data, total] = await Promise.all([
            prisma.event.findMany({
                where: whereClause,
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    startTime: "asc"
                },
                skip,
                take: limit
            }),
            prisma.event.count({
                where: whereClause
            })
        ]);
        return {
            data: data,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    async findById(id) {
        return prisma.event.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        role: true
                    }
                }
            }
        });
    },
    async create(data) {
        return prisma.event.create({
            data,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        role: true
                    }
                }
            }
        });
    },
    async update(id, data) {
        return prisma.event.update({
            where: { id },
            data,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        role: true
                    }
                }
            }
        });
    },
    async delete(id) {
        return prisma.event.delete({
            where: { id }
        });
    }
};
