import { MustahikRepository } from "./mustahik.repository"
import type {
  CreateMustahikData,
  UpdateMustahikData,
  MustahikQueryParams,
  PaginatedMustahiks
} from "./mustahik.type"
import prisma from "../../database"

export const MustahikService = {
  async getAll({
    category,
    page,
    limit
  }: MustahikQueryParams): Promise<PaginatedMustahiks> {
    const skip = (page - 1) * limit

    return MustahikRepository.findAll({
      category,
      skip,
      limit
    })
  },

  async create(data: CreateMustahikData) {
    const congregation = await prisma.congregation.findUnique({
      where: {
        id: data.congregationId
      }
    })

    if (!congregation) {
      throw new Error("CONGREGATION_NOT_FOUND")
    }

    return MustahikRepository.create(data)
  },

  async update(id: number, data: UpdateMustahikData) {
    const mustahik = await MustahikRepository.findById(id)

    if (!mustahik) {
      throw new Error("MUSTAHIK_NOT_FOUND")
    }

    return MustahikRepository.update(id, data)
  }
}