/*
  Warnings:

  - You are about to drop the column `category` on the `donations` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `donations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donations" DROP COLUMN "category",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "donation_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "donation_categories_name_key" ON "donation_categories"("name");

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "donation_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
