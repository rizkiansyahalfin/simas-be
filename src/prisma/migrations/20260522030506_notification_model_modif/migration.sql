/*
  Warnings:

  - A unique constraint covering the columns `[unique_key]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "unique_key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "notifications_unique_key_key" ON "notifications"("unique_key");
