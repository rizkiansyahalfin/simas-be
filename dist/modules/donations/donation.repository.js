import prisma from '../../database';
export const DonationRepository = {
    async create(data) {
        return prisma.donation.create({ data });
    },
    async findAll({ status, skip, limit, }) {
        const whereClause = status
            ? { status: status }
            : {};
        const [data, total] = await Promise.all([
            prisma.donation.findMany({
                where: whereClause,
                include: {
                    verifier: {
                        select: {
                            id: true,
                            username: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.donation.count({
                where: whereClause,
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page: Math.floor(skip / limit) + 1,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    async findById(id) {
        return prisma.donation.findUnique({
            where: { id },
            include: {
                verifier: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
            },
        });
    },
    async update(id, data) {
        return prisma.donation.update({
            where: { id },
            data,
            include: {
                verifier: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
            },
        });
    },
};
