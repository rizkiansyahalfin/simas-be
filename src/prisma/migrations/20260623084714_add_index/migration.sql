-- CreateIndex
CREATE INDEX "attendance_records_check_in_at_idx" ON "attendance_records"("check_in_at");

-- CreateIndex
CREATE INDEX "attendance_sessions_session_date_idx" ON "attendance_sessions"("session_date");

-- CreateIndex
CREATE INDEX "cash_transactions_deleted_at_type_transaction_date_idx" ON "cash_transactions"("deleted_at", "type", "transaction_date");

-- CreateIndex
CREATE INDEX "cash_transactions_transaction_date_idx" ON "cash_transactions"("transaction_date");

-- CreateIndex
CREATE INDEX "congregations_deleted_at_is_active_is_mustahik_idx" ON "congregations"("deleted_at", "is_active", "is_mustahik");

-- CreateIndex
CREATE INDEX "donations_created_at_status_idx" ON "donations"("created_at", "status");

-- CreateIndex
CREATE INDEX "events_created_at_status_idx" ON "events"("created_at", "status");

-- CreateIndex
CREATE INDEX "mustahik_distributions_distribution_date_idx" ON "mustahik_distributions"("distribution_date");

-- CreateIndex
CREATE INDEX "payments_transactionStatus_idx" ON "payments"("transactionStatus");

-- CreateIndex
CREATE INDEX "zis_transactions_deleted_at_transaction_date_idx" ON "zis_transactions"("deleted_at", "transaction_date");

-- CreateIndex
CREATE INDEX "zis_transactions_transaction_date_idx" ON "zis_transactions"("transaction_date");
