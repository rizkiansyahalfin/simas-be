import prisma from '../../database';
const buildCashWhere = (filters = {}) => {
    const where = { deletedAt: null };
    if (filters.type) {
        where.type = filters.type;
    }
    if (filters.category) {
        where.category = { contains: filters.category, mode: 'insensitive' };
    }
    if (filters.startDate || filters.endDate) {
        where.transactionDate = {};
        if (filters.startDate) {
            where.transactionDate.gte = filters.startDate;
        }
        if (filters.endDate) {
            where.transactionDate.lte = filters.endDate;
        }
    }
    if (filters.search) {
        where.OR = [
            { category: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
        ];
    }
    return where;
};
const buildZisWhere = (filters = {}) => {
    const where = { deletedAt: null };
    if (filters.type) {
        where.type = filters.type;
    }
    if (filters.zisCategory) {
        where.zisCategory = filters.zisCategory;
    }
    if (filters.startDate || filters.endDate) {
        where.transactionDate = {};
        if (filters.startDate) {
            where.transactionDate.gte = filters.startDate;
        }
        if (filters.endDate) {
            where.transactionDate.lte = filters.endDate;
        }
    }
    if (filters.search) {
        where.OR = [
            { muzakkiName: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
        ];
    }
    return where;
};
export const findCashTransactions = async ({ page = 1, limit = 10, filters = {}, }) => {
    const skip = (page - 1) * limit;
    return await prisma.cashTransaction.findMany({
        where: buildCashWhere(filters),
        orderBy: { transactionDate: 'desc' },
        skip,
        take: limit,
    });
};
export const countCashTransactions = async (filters = {}) => {
    return await prisma.cashTransaction.count({
        where: buildCashWhere(filters),
    });
};
export const findCashTransactionById = async (id) => {
    return await prisma.cashTransaction.findFirst({
        where: { id, deletedAt: null },
    });
};
export const createCashTransaction = async (data) => {
    return await prisma.cashTransaction.create({
        data,
    });
};
export const updateCashTransaction = async (id, data) => {
    return await prisma.cashTransaction.update({
        where: { id },
        data,
    });
};
export const softDeleteCashTransaction = async (id) => {
    return await prisma.cashTransaction.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};
export const findZisTransactions = async ({ page = 1, limit = 10, filters = {}, }) => {
    const skip = (page - 1) * limit;
    return await prisma.zisTransaction.findMany({
        where: buildZisWhere(filters),
        orderBy: { transactionDate: 'desc' },
        skip,
        take: limit,
    });
};
export const countZisTransactions = async (filters = {}) => {
    return await prisma.zisTransaction.count({
        where: buildZisWhere(filters),
    });
};
export const findZisTransactionById = async (id) => {
    return await prisma.zisTransaction.findFirst({
        where: { id, deletedAt: null },
    });
};
export const createZisTransaction = async (data) => {
    return await prisma.zisTransaction.create({
        data,
    });
};
export const updateZisTransaction = async (id, data) => {
    return await prisma.zisTransaction.update({
        where: { id },
        data,
    });
};
export const softDeleteZisTransaction = async (id) => {
    return await prisma.zisTransaction.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};
export const findSummaryData = async (start, end) => {
    const baseWhere = {
        deletedAt: null,
        transactionDate: {
            gte: start,
            lte: end,
        },
    };
    const [cashSummary, zisSummary] = await Promise.all([
        prisma.cashTransaction.groupBy({
            by: ['type'],
            where: baseWhere,
            _sum: { amount: true },
        }),
        prisma.zisTransaction.groupBy({
            by: ['type'],
            where: baseWhere,
            _sum: { amount: true },
        }),
    ]);
    return { cashSummary, zisSummary };
};
