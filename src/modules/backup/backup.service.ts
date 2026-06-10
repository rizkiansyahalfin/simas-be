import fs from "fs"
import path from "path"
import zlib from "zlib"
import { promisify } from "util"
import { exec } from "child_process"
import { BackupResult } from "./backup.type"

const execAsync = promisify(exec)

const BACKUP_DIRECTORY = path.resolve(
  process.cwd(),
  "storage",
  "backups"
)

export const BackupService = {

  async createBackup(): Promise<BackupResult> {

    const databaseUrl =
      process.env.DATABASE_URL

    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL_MISSING"
      )
    }

    if (
      !fs.existsSync(
        BACKUP_DIRECTORY
      )
    ) {
      fs.mkdirSync(
        BACKUP_DIRECTORY,
        { recursive: true }
      )
    }

    const timestamp =
      new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\./g, "-")

    const sqlFileName =
      `backup-${timestamp}.sql`

    const gzipFileName =
      `${sqlFileName}.gz`

    const sqlFilePath =
      path.join(
        BACKUP_DIRECTORY,
        sqlFileName
      )

    const gzipFilePath =
      path.join(
        BACKUP_DIRECTORY,
        gzipFileName
      )

    await execAsync(
      `pg_dump "${databaseUrl}" -f "${sqlFilePath}"`
    )

    await new Promise<void>(
      (
        resolve,
        reject
      ) => {

        const readStream =
          fs.createReadStream(
            sqlFilePath
          )

        const writeStream =
          fs.createWriteStream(
            gzipFilePath
          )

        const gzip =
          zlib.createGzip()

        readStream
          .pipe(gzip)
          .pipe(writeStream)
          .on(
            "finish",
            () => resolve()
          )
          .on(
            "error",
            reject
          )
      }
    )

    fs.unlinkSync(
      sqlFilePath
    )

    const stats =
      fs.statSync(
        gzipFilePath
      )

    return {
      fileName:
        gzipFileName,

      fileSize:
        stats.size,

      createdAt:
        new Date()
          .toISOString()
    }
  }
}