import { midtransConfig } from "../../config/midtrans.config"

export const validateWebhookSecret = (
  secret?: string
) => {
  return (
    secret &&
    secret ===
      midtransConfig.webhookSecret
  )
}