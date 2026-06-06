import cron from "node-cron"
import { PaymentService }
from "./payment.service"

export const startPaymentRetryJob =
  () => {

    cron.schedule(
      "*/15 * * * *",
      async () => {

        console.log(
          "Running payment retry job..."
        )

        try {

          const result =
            await PaymentService.retryPendingTransactions()

          console.log(
            `Checked=${result.checked}, Processed=${result.processed}, Alerted=${result.alerted}`
          )

        } catch (error) {

          console.error(
            "Payment retry job failed",
            error
          )
        }
      }
    )
  }