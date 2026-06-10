import {
  Request,
  Response
} from "express"

import {
  BackupService
} from "./backup.service"

export const BackupController = {

  async createBackup(
    req: Request,
    res: Response
  ) {

    try {

      const result =
        await BackupService
          .createBackup()

      return res
        .status(200)
        .json({
          success: true,
          data: result
        })

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,
          error_code:
            error instanceof Error
              ? error.message
              : "BACKUP_FAILED"
        })
    }
  }
}