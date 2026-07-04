import fs from "fs"
import path from "path"

const BACKUP_DIRECTORY = path.resolve(
  process.cwd(),
  "storage",
  "backups"
)

const MAX_BACKUPS = Math.max(
  1,
  Number(
    process.env
      .BACKUP_KEEP_COUNT
  ) || 4
)

export const BackupRotationService = {

  async rotateBackups(): Promise<void> {

    if (
      !fs.existsSync(
        BACKUP_DIRECTORY
      )
    ) {
      return
    }

    if (
      process.env
        .BACKUP_CRON_ENABLED !==
      "true"
    ) {
      return
    }

    const backupFiles =
      fs
        .readdirSync(
          BACKUP_DIRECTORY
        )
        .filter(
          file =>
            file.endsWith(
              ".sql.gz"
            )
        )
        .map(file => {

          const fullPath =
            path.join(
              BACKUP_DIRECTORY,
              file
            )

          const stats =
            fs.statSync(
              fullPath
            )

          return {
            file,
            fullPath,
            createdAt:
              stats.birthtime
          }
        })
        .sort(
          (a, b) =>
            b.createdAt.getTime() -
            a.createdAt.getTime()
        )

    const filesToDelete =
      backupFiles.slice(
        MAX_BACKUPS
      )

    for (
      const file
      of filesToDelete
    ) {
      try {
        fs.unlinkSync(
          file.fullPath
        )
        console.log(
          `[BACKUP_ROTATION] Deleted old backup: ${file.file}`
        )
      } catch (error) {
        console.error(
          `[BACKUP_ROTATION] Failed to delete: ${file.file}`,
          error instanceof Error ? error.message : String(error)
        )
      }
    }
  }
}