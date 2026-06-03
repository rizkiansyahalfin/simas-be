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

export interface RefundRequest {
  refund_key: string
  amount: number
  reason: string
}

/**
 * Process refund through Midtrans API
 * Midtrans CoreApi doesn't have built-in refund method, so we make direct HTTP request
 */
export const processRefund = async (
  orderId: string,
  refundData: RefundRequest
): Promise<{ status: string; refund_key: string }> => {
  const baseUrl = midtransConfig.isProduction
    ? "https://app.midtrans.com/api/v2"
    : "https://app.sandbox.midtrans.com/api/v2"

  const url = `${baseUrl}/${orderId}/refund`

  // Create Basic Auth header
  const authString = Buffer.from(`${midtransConfig.serverKey}:`).toString("base64")

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(refundData),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `MIDTRANS_REFUND_FAILED: ${response.status} - ${errorBody}`
      )
    }

    const result = await response.json()
    return result
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("MIDTRANS_REFUND_FAILED:")) {
        throw new Error(`MIDTRANS_REFUND_REQUEST_ERROR: ${error.message}`, 
        { cause: error})
      }
    }
    throw error
  }
}