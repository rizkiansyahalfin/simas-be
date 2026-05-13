import { CongregationRepository } from "./congregation.repository";
export const CongregationService = {
    async getAll(query) {
        const skip = Math.max((query.page - 1) * query.limit, 0);
        return CongregationRepository.findAll({
            search: query.search,
            gender: query.gender,
            isMustahik: query.isMustahik,
            skip,
            limit: query.limit
        });
    },
    async create(data) {
        return CongregationRepository.create(data);
    },
    async update(id, data) {
        const existing = await CongregationRepository.findById(id);
        if (!existing) {
            throw new Error("CONGREGATION_NOT_FOUND");
        }
        return CongregationRepository.update(id, data);
    },
    async delete(id) {
        const existing = await CongregationRepository.findById(id);
        if (!existing) {
            throw new Error("CONGREGATION_NOT_FOUND");
        }
        return CongregationRepository.softDelete(id);
    }
};
