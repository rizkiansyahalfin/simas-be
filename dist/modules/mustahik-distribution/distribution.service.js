import { DistributionRepository } from "./distribution.repository";
import prisma from "../../database";
export const DistributionService = {
    async getHistory({ page, limit }) {
        const skip = (page - 1) * limit;
        return DistributionRepository.findAll({
            skip,
            limit
        });
    },
    async create(data) {
        // Validate mustahik exists
        const mustahik = await prisma.mustahik.findUnique({
            where: {
                id: data.mustahikId
            }
        });
        if (!mustahik) {
            throw new Error("MUSTAHIK_NOT_FOUND");
        }
        // Validate zisTransaction exists and is income
        const transaction = await prisma.zisTransaction.findUnique({
            where: {
                id: data.zisTransactionId
            }
        });
        if (!transaction) {
            throw new Error("ZIS_TRANSACTION_NOT_FOUND");
        }
        if (transaction.type !== "income") {
            throw new Error("INVALID_ZIS_TRANSACTION_TYPE");
        }
        // Calculate total distributed amount for this transaction
        const distributed = await prisma.mustahikDistribution.aggregate({
            where: {
                zisTransactionId: data.zisTransactionId
            },
            _sum: {
                amount: true
            }
        });
        const usedAmount = Number(distributed._sum.amount || 0);
        const available = Number(transaction.amount) - usedAmount;
        if (data.amount > available) {
            throw new Error("INSUFFICIENT_ZIS_BALANCE");
        }
        return DistributionRepository.create(data);
    }
};
