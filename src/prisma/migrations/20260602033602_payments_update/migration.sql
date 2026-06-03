/*
  Warnings:

  - You are about to drop the column `donationId` on the `payments` table. All the data in the column will be lost.
  - Added the required column `donation_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_donationId_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "donationId",
ADD COLUMN     "donation_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
