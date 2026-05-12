-- CreateEnum
CREATE TYPE "Role" AS ENUM ('superadmin', 'bendahara', 'admin_kegiatan', 'admin_inventaris');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "ZisCategory" AS ENUM ('zakat', 'infaq', 'shadaqah');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('pending', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "InventoryCondition" AS ENUM ('baik', 'rusak_ringan', 'rusak_berat', 'hilang');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('borrowed', 'returned', 'overdue');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "MustahikCategory" AS ENUM ('fakir', 'miskin', 'amil', 'muallaf', 'riqab', 'gharim', 'fisabilillah', 'ibnu_sabil');

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" VARCHAR(255),
    "author_id" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_transactions" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "transaction_date" DATE NOT NULL,
    "created_by" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "congregations" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "nik" VARCHAR(50),
    "address" TEXT,
    "phone" VARCHAR(20),
    "gender" "Gender",
    "birth_date" DATE,
    "is_mustahik" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "congregations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" SERIAL NOT NULL,
    "donor_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "amount" DECIMAL(15,2) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "proof_image_url" VARCHAR(255),
    "status" "DonationStatus" NOT NULL DEFAULT 'pending',
    "verified_by" INTEGER,
    "verified_at" TIMESTAMP(3),
    "rejection_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "speaker" VARCHAR(100),
    "location" VARCHAR(255),
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'upcoming',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "item_code" VARCHAR(50) NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "condition" "InventoryCondition" NOT NULL DEFAULT 'baik',
    "acquired_date" DATE,
    "acquisition_cost" DECIMAL(15,2),
    "notes" TEXT,
    "managed_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_loans" (
    "id" SERIAL NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "borrower_name" VARCHAR(100) NOT NULL,
    "borrower_phone" VARCHAR(20),
    "loan_date" DATE NOT NULL,
    "expected_return_date" DATE NOT NULL,
    "actual_return_date" DATE,
    "status" "LoanStatus" NOT NULL DEFAULT 'borrowed',
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jumat_schedules" (
    "id" SERIAL NOT NULL,
    "jumat_date" DATE NOT NULL,
    "imam" VARCHAR(100),
    "khatib" VARCHAR(100),
    "muadzin" VARCHAR(100),
    "tema_khutbah" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jumat_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mustahik_distributions" (
    "id" SERIAL NOT NULL,
    "mustahik_id" INTEGER NOT NULL,
    "zis_transaction_id" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "distribution_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mustahik_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mustahiks" (
    "id" SERIAL NOT NULL,
    "congregation_id" INTEGER NOT NULL,
    "category" "MustahikCategory" NOT NULL,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mustahiks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_schedules" (
    "id" SERIAL NOT NULL,
    "prayer_date" DATE NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "subuh" TIME,
    "dzuhur" TIME,
    "ashar" TIME,
    "maghrib" TIME,
    "isya" TIME,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zis_transactions" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "zis_category" "ZisCategory" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "muzakki_name" VARCHAR(100),
    "description" TEXT,
    "transaction_date" DATE NOT NULL,
    "created_by" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zis_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "congregations_nik_key" ON "congregations"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "mustahiks_congregation_id_key" ON "mustahiks"("congregation_id");

-- CreateIndex
CREATE INDEX "idx_prayer_date" ON "prayer_schedules"("prayer_date", "city");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_transactions" ADD CONSTRAINT "cash_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_managed_by_fkey" FOREIGN KEY ("managed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_loans" ADD CONSTRAINT "inventory_loans_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_loans" ADD CONSTRAINT "inventory_loans_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jumat_schedules" ADD CONSTRAINT "jumat_schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mustahik_distributions" ADD CONSTRAINT "mustahik_distributions_mustahik_id_fkey" FOREIGN KEY ("mustahik_id") REFERENCES "mustahiks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mustahik_distributions" ADD CONSTRAINT "mustahik_distributions_zis_transaction_id_fkey" FOREIGN KEY ("zis_transaction_id") REFERENCES "zis_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mustahiks" ADD CONSTRAINT "mustahiks_congregation_id_fkey" FOREIGN KEY ("congregation_id") REFERENCES "congregations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zis_transactions" ADD CONSTRAINT "zis_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
