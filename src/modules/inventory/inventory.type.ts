export interface InventoryResponse {
  id: number
  itemCode: string
  itemName: string
  category: string
  quantity: number
  condition: 'baik' | 'rusak_ringan' | 'rusak_berat' | 'hilang'
  acquiredDate?: Date
  acquisitionCost?: number
  notes?: string
  managedBy: number
  createdAt: Date
  updatedAt: Date
}