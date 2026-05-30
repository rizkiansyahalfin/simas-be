-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('active', 'completed', 'cancelled', 'draft');

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "campaign_id" INTEGER;

-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "target_amount" DECIMAL(15,2) NOT NULL,
    "thumbnail_url" VARCHAR(255),
    "deadline" DATE,
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "caption" TEXT,
    "image_url" VARCHAR(255) NOT NULL,
    "uploaded_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mosque_profiles" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "history" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "contact_phone" VARCHAR(20),
    "contact_email" VARCHAR(100),
    "instagram_url" VARCHAR(255),
    "youtube_url" VARCHAR(255),
    "facebook_url" VARCHAR(255),
    "bank_name" VARCHAR(100),
    "bank_account" VARCHAR(100),
    "bank_holder" VARCHAR(100),
    "qris_image_url" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mosque_profiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
