-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('create', 'update', 'delete');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" "AuditAction" NOT NULL,
    "module" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(100),
    "ip_address" VARCHAR(100),
    "user_agent" TEXT,
    "before_data" JSONB,
    "after_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
