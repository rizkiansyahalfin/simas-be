import fs from "fs"
import path from "path"

const BACKUP_DIRECTORY = path.resolve(
  process.cwd(),
  "storage",
  "backups"
)

const MAX_BACKUPS =
  Number(
    process.env
      .BACKUP_KEEP_COUNT
  ) || 4

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

      fs.unlinkSync(
        file.fullPath
      )
    }
  }
}