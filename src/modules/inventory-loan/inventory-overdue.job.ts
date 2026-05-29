import cron from "node-cron"
import { InventoryLoanService } from "./inventory-loan.service"

export const startInventoryOverdueJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running inventory overdue job...")

    try {
      const overdueCount = await InventoryLoanService.markOverdueLoans()
      console.log(`Inventory overdue job completed. ${overdueCount} loan(s) marked overdue.`)
    } catch (err) {
      console.error("Inventory overdue job failed:", err)
    }
  })
}
