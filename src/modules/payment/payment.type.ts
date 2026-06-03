export interface MidtransConfig {
  serverKey: string
  clientKey: string
  isProduction: boolean
  webhookSecret?: string
}

export interface CreateTransactionInput {
  donorName: string
  donorEmail: string
  phone?: string
  amount: number
  categoryId: number
  campaignId?: number
}

export interface CreatePaymentInput {
  donationId: number
  campaignId?: number
  orderId: string
  donorName: string
  donorEmail: string
  amount: number
  snapToken: string
}

export interface UpdatePaymentInput {
  transactionId?: string
  paymentType?: string
  transactionStatus?: string
  fraudStatus?: string
}

export interface MidtransWebhookPayload {
  transaction_time: string
  transaction_status: string
  transaction_id: string
  status_message: string
  status_code: string
  signature_key: string
  settlement_time?: string
  order_id: string
  merchant_id: string
  gross_amount: string
  fraud_status?: string
  payment_type?: string
}