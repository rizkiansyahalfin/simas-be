import prisma from "../../database";
export const CongregationRepository = {
    async findAll({ search, gender, isMustahik, skip, limit }) {
        const whereClause = {
            deletedAt: null
        };
        if (search) {
            whereClause.OR = [
                {
                    fullName: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    nik: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    phone: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ];
        }
        if (gender) {
            whereClause.gender = gender;
        }
        if (typeof isMustahik === "boolean") {
            whereClause.isMustahik = isMustahik;
        }
        const [data, total] = await Promise.all([
            prisma.congregation.findMany({
                where: whereClause,
                include: { mustahik: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.congregation.count({
                where: whereClause
            })
        ]);
        return {
            data,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },
    async findById(id) {
        return prisma.congregation.findFirst({
            where: {
                id,
                deletedAt: null
            }
        });
    },
    async create(data) {
        return prisma.congregation.create({
            data
        });
    },
    async update(id, data) {
        return prisma.congregation.update({
            where: { id },
            data
        });
    },
    async softDelete(id) {
        return prisma.congregation.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false
            }
        });
    }
};
