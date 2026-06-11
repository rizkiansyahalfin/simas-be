import cron from "node-cron"

import {
  BackupService
} from "./backup.service"

import {
  BackupRotationService
} from "./backup-rotation.service"

export const BackupCron = {

  start(): void {

    cron.schedule(
      "0 0 * * 0",
      async () => {

        try {

          console.log(
            "[BACKUP_CRON] Started"
          )

          await BackupService
            .createBackup()

          await BackupRotationService
            .rotateBackups()

          console.log(
            "[BACKUP_CRON] Success"
          )

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          const errorStack = error instanceof Error ? error.stack : undefined

          console.error(
            "[BACKUP_CRON] Failed",
            {
              timestamp: new Date().toISOString(),
              message: errorMessage,
              stack: errorStack
            }
          )
        }
      }
    )

    console.log(
      "[BACKUP_CRON] Registered"
    )
  }
}