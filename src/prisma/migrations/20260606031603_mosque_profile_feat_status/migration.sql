-- AlterTable
ALTER TABLE "mosque_profiles" ADD COLUMN     "campaign_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "default_language" TEXT NOT NULL DEFAULT 'id',
ADD COLUMN     "donation_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "event_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inventory_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "prayer_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta';
