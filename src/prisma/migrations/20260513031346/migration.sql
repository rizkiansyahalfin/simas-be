/*
  Warnings:

  - A unique constraint covering the columns `[prayer_date,city]` on the table `prayer_schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `congregations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "congregations" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "PrayerConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "city" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prayer_schedules_prayer_date_city_key" ON "prayer_schedules"("prayer_date", "city");
