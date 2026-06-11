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

          console.error(
            "[BACKUP_CRON] Failed",
            error
          )
        }
      }
    )

    console.log(
      "[BACKUP_CRON] Registered"
    )
  }
}