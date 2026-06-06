import { snap } from "../../config/midtrans.config"
import type { SnapTransactionParameters } from "midtrans-client"
import type {
  SnapTransactionInput,
  SnapTransactionResult,
} from "./payment.type"

export const requestMidtransSnapToken = async (
  input: SnapTransactionInput
): Promise<SnapTransactionResult> => {
  const customerDetails = {
    first_name: input.donorName,
    email: input.donorEmail,
    ...(input.phone ? { phone: input.phone } : {}),
  }

  const transactionPayload: SnapTransactionParameters & {
    customer_details: typeof customerDetails
  } = {
    transaction_details: {
      order_id: input.orderId,
      gross_amount: input.amount,
    },
    customer_details: customerDetails,
  }

  const transaction = await snap.createTransaction(
    transactionPayload
  )

  return {
    snapToken: transaction.token,
    redirectUrl: transaction.redirect_url,
  }
}
