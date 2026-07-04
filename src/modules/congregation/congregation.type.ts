import type { Gender } from "../../generated/enums"
import { Prisma } from "../../generated/client"

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


export type CongregationImportRow = {
  fullName?: string
  nik?: string | null
  address?: string | null
  phone?: string | null
  gender?: Gender | string | null
  isMustahik?: boolean | string | null
  birthDate?: string | Date | null
}
