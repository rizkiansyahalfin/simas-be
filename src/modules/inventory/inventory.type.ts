import type { Prisma } from '../../generated/client'
import type { InventoryCondition } from '../../generated/enums'

export type InventoryWithManager = Prisma.InventoryGetPayload<{
  include: { manager: true; inventoryLoans: true }
}>

export interface InventoryResponse {
  id: number
  itemCode: string
  itemName: string
  category: string
  quantity: number
  condition: InventoryCondition
  acquiredDate?: Date
  acquisitionCost?: number | string
  notes?: string
  managedBy: number
  createdAt: Date
  updatedAt: Date
  manager?: {
    id: number
    username: string
    email: string
  }
  inventoryLoans?: Array<{
    id: number
    borrowerName: string
    loanDate: Date
    expectedReturnDate: Date
    actualReturnDate?: Date
    status: string
  }>
}

export interface FilterInventoryParams {
  condition?: InventoryCondition
  category?: string
  search?: string
  page: number
  limit: number
}