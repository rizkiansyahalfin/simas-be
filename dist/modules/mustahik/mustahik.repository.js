import prisma from "../../database";
export const MustahikRepository = {
    async findAll({ category, skip, limit }) {
        const whereClause = category ? { category: category } : {};
        const [data, total] = await Promise.all([
            prisma.mustahik.findMany({
                where: whereClause,
                include: {
                    congregation: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit
            }),
            prisma.mustahik.count({
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
        return prisma.mustahik.findUnique({
            where: { id },
            include: {
                congregation: true
            }
        });
    },
    async create(data) {
        return prisma.mustahik.create({
            data,
            include: {
                congregation: true
            }
        });
    },
    async update(id, data) {
        return prisma.mustahik.update({
            where: { id },
            data,
            include: {
                congregation: true
            }
        });
    }
};
