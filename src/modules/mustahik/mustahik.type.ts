import { MustahikCategory } from "../../prisma/generated/prisma"

export interface Mustahik {
  id: number
  congregationId: number
  category: MustahikCategory
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  congregation?: {
    id: number
    name: string
    phone?: string | null
    nik?: string | null
    address?: string | null
    gender?: string | null
    birthDate?: Date | null
    isMustahik: boolean
  }
}

export interface CreateMustahikData {
  congregationId: number
  category: MustahikCategory
  notes?: string
}

export interface UpdateMustahikData {
  congregationId?: number
  category?: MustahikCategory
  notes?: string
}

export interface MustahikQueryParams {
  category?: string
  page: number
  limit: number
}

export interface MustahikRepositoryParams {
  category?: string
  skip: number
  limit: number
}

export interface PaginatedMustahiks {
  data: Mustahik[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}