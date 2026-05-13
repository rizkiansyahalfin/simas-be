import type { Prisma, Gender } from "../../prisma/generated/prisma"

export type CongregationWithMustahik = Prisma.CongregationGetPayload<{
  include: { mustahik: true }
}>

export interface CongregationFindAllParams {
  search?: string
  gender?: Gender
  isMustahik?: boolean
  skip: number
  limit: number
}

export interface PaginatedCongregations {
  data: CongregationWithMustahik[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
