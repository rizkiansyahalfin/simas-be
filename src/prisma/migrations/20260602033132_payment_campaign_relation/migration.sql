/*
  Warnings:

  - You are about to drop the column `donation_id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `donor_email` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donor_name` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Made the column `transaction_status` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_donation_id_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "donation_id",
ADD COLUMN     "campaign_id" INTEGER,
ADD COLUMN     "donationId" INTEGER,
ADD COLUMN     "donor_email" TEXT NOT NULL,
ADD COLUMN     "donor_name" TEXT NOT NULL,
ADD COLUMN     "fraud_status" TEXT,
ALTER COLUMN "transaction_status" SET NOT NULL,
ALTER COLUMN "transaction_status" SET DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
