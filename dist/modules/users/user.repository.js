import prisma from "../../database";
const buildWhere = (filters = {}) => {
    const where = {};
    if (filters.role) {
        where.role = filters.role;
    }
    if (typeof filters.isActive === "boolean") {
        where.isActive = filters.isActive;
    }
    if (filters.search) {
        where.OR = [
            { username: { contains: filters.search, mode: "insensitive" } },
            { email: { contains: filters.search, mode: "insensitive" } }
        ];
    }
    return where;
};
export const UserRepository = {
    async findAll(skip, take, filters = {}) {
        return prisma.user.findMany({
            where: buildWhere(filters),
            skip,
            take,
            orderBy: { createdAt: "desc" }
        });
    },
    async count(filters = {}) {
        return prisma.user.count({
            where: buildWhere(filters)
        });
    },
    async findById(id) {
        return prisma.user.findUnique({
            where: { id }
        });
    },
    async create(data) {
        return prisma.user.create({ data });
    },
    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data
        });
    },
    async updateStatus(id, isActive) {
        return prisma.user.update({
            where: { id },
            data: { isActive }
        });
    }
};
