import { CongregationRepository } from "./congregation.repository"
import type {
  CongregationQueryInput,
  CreateCongregationInput,
  UpdateCongregationInput
} from "./congregation.validation"
import type { PaginatedCongregations } from "./congregation.type"

export const CongregationService = {
  async getAll(query: CongregationQueryInput): Promise<PaginatedCongregations> {
    const skip = Math.max((query.page - 1) * query.limit, 0)

    return await CongregationRepository.findAll({
      search: query.search,
      gender: query.gender,
      isMustahik: query.isMustahik,
      skip,
      limit: query.limit
    })
  },

  async create(data: CreateCongregationInput) {
    return CongregationRepository.create(data)
  },

  async update(id: number, data: UpdateCongregationInput) {
    const existing = await CongregationRepository.findById(id)

    if (!existing) {
      throw new Error("CONGREGATION_NOT_FOUND")
    }

    return CongregationRepository.update(id, data)
  },

  async delete(id: number) {
    const existing = await CongregationRepository.findById(id)

    if (!existing) {
      throw new Error("CONGREGATION_NOT_FOUND")
    }

    return CongregationRepository.softDelete(id)
  }
}
