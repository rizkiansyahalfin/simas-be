import fs from "fs"
import path from "path"
import { execSync } from "child_process"


const BACKUP_DIRECTORY = path.resolve(process.cwd(), "storage", "backups")

export const BackupUtils = {
  getBackupDirectory(): string {
    return BACKUP_DIRECTORY
  },

  ensureBackupDirectoryExists(): void {
    if (!fs.existsSync(BACKUP_DIRECTORY)) {
      fs.mkdirSync(BACKUP_DIRECTORY, { recursive: true })
    }
  },

  generateBackupFileName(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    return `backup-${timestamp}.sql.gz`
  },

  validateDatabaseUrl(url: string | undefined): void {
    if (!url) {
      throw new Error("DATABASE_URL_MISSING")
    }
  },

  validatePgDumpAvailable(): void {
    try {
      execSync("pg_dump --version", { stdio: "pipe" })
    } catch {
      throw new Error("PG_DUMP_NOT_AVAILABLE")
    }
  }
}
