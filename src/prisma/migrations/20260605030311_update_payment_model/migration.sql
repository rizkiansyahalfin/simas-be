-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "alertedAt" TIMESTAMP(3),
ADD COLUMN     "lastCheckedAt" TIMESTAMP(3),
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;
