/*
  Warnings:

  - Added the required column `province` to the `PrayerConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrayerConfig" ADD COLUMN     "province" TEXT NOT NULL;
