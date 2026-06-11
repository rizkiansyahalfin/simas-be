import fs from "fs"
import path from "path"
import zlib from "zlib"
import { pipeline } from "stream/promises"
import { exec } from "child_process"
import { promisify } from "util"
import { BackupResult } from "./backup.type"
import { BackupUtils } from "./backup.utils"

const execAsync = promisify(exec)

async function compressFile(
  inputPath: string,
  outputPath: string
): Promise<void> {
  const readStream = fs.createReadStream(inputPath)
  const writeStream = fs.createWriteStream(outputPath)
  const gzip = zlib.createGzip()

  try {
    await pipeline(readStream, gzip, writeStream)
  } catch (error) {
    // Clean up on compression failure
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath)
    }
    throw error
  }
}

export const BackupService = {
  async createBackup(): Promise<BackupResult> {
    const databaseUrl = process.env.DATABASE_URL

    BackupUtils.validateDatabaseUrl(databaseUrl)
    BackupUtils.ensureBackupDirectoryExists()
    BackupUtils.validatePgDumpAvailable()
    BackupUtils.validateBackupEnabled()

    const backupDir = BackupUtils.getBackupDirectory()
    const fileName = BackupUtils.generateBackupFileName()
    const sqlFileName = fileName.replace(".gz", "")

    const sqlFilePath = path.join(backupDir, sqlFileName)
    const gzipFilePath = path.join(backupDir, fileName)

    try {
      // Execute pg_dump to create SQL file
      await execAsync(
        `pg_dump "${databaseUrl}" -f "${sqlFilePath}"`,
        { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer for large databases
      )

      // Compress the SQL file using streams
      await compressFile(sqlFilePath, gzipFilePath)

      // Clean up the original SQL file
      fs.unlinkSync(sqlFilePath)

      // Get file stats
      const stats = fs.statSync(gzipFilePath)

      return {
        fileName,
        fileSize: stats.size,
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      // Clean up on failure
      if (fs.existsSync(sqlFilePath)) {
        fs.unlinkSync(sqlFilePath)
      }
      if (fs.existsSync(gzipFilePath)) {
        fs.unlinkSync(gzipFilePath)
      }
      throw error
    }
  },

  async listBackups(): Promise<BackupResult[]> {
    BackupUtils.ensureBackupDirectoryExists()
    const backupDir = BackupUtils.getBackupDirectory()

    const files = fs
      .readdirSync(backupDir)
      .filter((file) => file.endsWith(".sql.gz"))
      .map((fileName) => {
        const filePath = path.join(backupDir, fileName)
        const stats = fs.statSync(filePath)
        return {
          fileName,
          fileSize: stats.size,
          createdAt: new Date(stats.birthtime).toISOString()
        }
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )

    return files
  },

  async deleteBackup(fileName: string): Promise<void> {
    // Validate filename to prevent directory traversal
    if (fileName.includes("..") || fileName.includes("/")) {
      throw new Error("INVALID_BACKUP_NAME")
    }

    const backupDir = BackupUtils.getBackupDirectory()
    const filePath = path.join(backupDir, fileName)

    // Ensure the file is actually in the backup directory
    if (!filePath.startsWith(backupDir)) {
      throw new Error("INVALID_BACKUP_PATH")
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("BACKUP_NOT_FOUND")
    }

    fs.unlinkSync(filePath)
  }
}
