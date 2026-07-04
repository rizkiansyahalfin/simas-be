import { snap } from "../../config/midtrans.config"
import type { SnapTransactionParameters } from "midtrans-client"
import type {
  SnapTransactionInput,
  SnapTransactionResult,
} from "./payment.type"

const isLoadTest = (): boolean => {
  return process.env.LOAD_TEST === "test"
}

export const requestMidtransSnapToken = async (
  input: SnapTransactionInput
): Promise<SnapTransactionResult> => {
  if (isLoadTest()) {
    return {
      snapToken: `mock-snap-token-${input.orderId}`,
      redirectUrl: `https://mock.midtrans.com/redirect/${input.orderId}`,
    }
  }

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
