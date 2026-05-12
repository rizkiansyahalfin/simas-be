import type { Prisma } from "../../generated/client"
import type { Gender } from "../../generated/enums"

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
