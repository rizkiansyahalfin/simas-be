/*
  Warnings:

  - You are about to drop the column `created_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `fraud_status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `payments` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "created_at",
DROP COLUMN "fraud_status",
DROP COLUMN "transaction_status",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fraudStatus" TEXT,
ADD COLUMN     "refundAmount" DECIMAL(15,2),
ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "transactionStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
