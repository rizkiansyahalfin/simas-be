import { MustahikRepository } from "./mustahik.repository";
import prisma from "../../database";
export const MustahikService = {
    async getAll({ category, page, limit }) {
        const skip = (page - 1) * limit;
        return MustahikRepository.findAll({
            category,
            skip,
            limit
        });
    },
    async create(data) {
        const congregation = await prisma.congregation.findUnique({
            where: {
                id: data.congregationId
            }
        });
        if (!congregation) {
            throw new Error("CONGREGATION_NOT_FOUND");
        }
        return MustahikRepository.create(data);
    },
    async update(id, data) {
        const mustahik = await MustahikRepository.findById(id);
        if (!mustahik) {
            throw new Error("MUSTAHIK_NOT_FOUND");
        }
        return MustahikRepository.update(id, data);
    }
};
