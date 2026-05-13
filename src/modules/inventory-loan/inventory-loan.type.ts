import type { Prisma } from "../../generated/client"
import type { LoanStatus, InventoryCondition } from "../../generated/enums"

export type InventoryLoanWithRelations = Prisma.InventoryLoanGetPayload<{
  include: { inventory: true; creator: true }
}>

export interface CreateInventoryLoanData {
  inventoryId: number
  borrowerName: string
  borrowerPhone?: string
  loanDate: Date
  expectedReturnDate: Date
  notes?: string
  createdBy: number
}

export interface UpdateInventoryLoanData {
  borrowerName?: string
  borrowerPhone?: string
  loanDate?: Date
  expectedReturnDate?: Date
  notes?: string
}

export interface ReturnLoanData {
  actualReturnDate?: Date
  notes?: string
  condition?: InventoryCondition
}

export interface LoanQueryParams {
  status?: LoanStatus
  borrowerName?: string
  page: number
  limit: number
}

export interface LoanRepositoryParams {
  status?: LoanStatus
  borrowerName?: string
  skip: number
  limit: number
}

export interface PaginatedInventoryLoans {
  data: InventoryLoanWithRelations[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}