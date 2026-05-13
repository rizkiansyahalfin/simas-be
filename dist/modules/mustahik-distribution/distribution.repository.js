import prisma from "../../database";
export const DistributionRepository = {
    async findAll({ skip, limit }) {
        const [data, total] = await Promise.all([
            prisma.mustahikDistribution.findMany({
                include: {
                    mustahik: {
                        include: {
                            congregation: true
                        }
                    },
                    zisTransaction: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit
            }),
            prisma.mustahikDistribution.count()
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
    async create(data) {
        return prisma.mustahikDistribution.create({
            data: {
                ...data,
                distributionDate: new Date(data.distributionDate)
            },
            include: {
                mustahik: {
                    include: {
                        congregation: true
                    }
                },
                zisTransaction: true
            }
        });
    }
};
