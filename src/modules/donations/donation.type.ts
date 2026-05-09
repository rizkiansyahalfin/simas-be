export interface DonationResponse {
  id: number
  donorName: string
  donorEmail?: string
  phone?: string
  amount: number
  category: string
  proofImageUrl?: string
  status: 'pending' | 'verified' | 'rejected'
  verifiedBy?: number
  verifiedAt?: Date
  rejectionNote?: string
  createdAt: Date
}