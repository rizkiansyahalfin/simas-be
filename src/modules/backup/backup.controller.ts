import { Request, Response } from "express"
import { BackupService } from "./backup.service"
import { RestoreService } from "./restore.service"
import {  confirmRestoreSchema} from "./restore.validation"

export const BackupController = {
  async createBackup(req: Request, res: Response) {
    try {
      const result = await BackupService.createBackup()

      return res.status(200).json({
        success: true,
        data: result
      })
    } catch (error: unknown) {
      const errorCode = error instanceof Error ? error.message : "BACKUP_FAILED"
      const status =
        errorCode === "PG_DUMP_NOT_AVAILABLE" ||
        errorCode === "DATABASE_URL_MISSING"
          ? 400
          : 500

      return res.status(status).json({
        success: false,
        error_code: errorCode
      })
    }
  },

  async listBackups(req: Request, res: Response) {
    try {
      const backups = await BackupService.listBackups()

      return res.status(200).json({
        success: true,
        data: backups
      })
    } catch (error: unknown) {
      const errorCode = error instanceof Error ? error.message : "LIST_BACKUPS_FAILED"

      return res.status(500).json({
        success: false,
        error_code: errorCode
      })
    }
  },

  async deleteBackup(req: Request, res: Response) {
    try {
      const fileName = req.params.fileName

      if (!fileName || Array.isArray(fileName)) {
        return res.status(400).json({
          success: false,
          error_code: "FILENAME_REQUIRED"
        })
      }

      await BackupService.deleteBackup(fileName)

      return res.status(200).json({
        success: true,
        message: "Backup deleted successfully"
      })
    } catch (error: unknown) {
      const errorCode = error instanceof Error ? error.message : "DELETE_BACKUP_FAILED"
      const status =
        errorCode === "INVALID_BACKUP_NAME" ||
        errorCode === "INVALID_BACKUP_PATH" ||
        errorCode === "BACKUP_NOT_FOUND"
          ? 400
          : 500

      return res.status(status).json({
        success: false,
        error_code: errorCode
      })
    }
  },
  async validateRestore(
  req: Request,
  res: Response
) {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        error_code:
          "BACKUP_FILE_REQUIRED"
      })
    }

    const result =
      await RestoreService
        .validateBackup(
          req.file
        )

    return res.status(200).json({
      success: true,
      data: result
    })

  } catch (error) {

    return res.status(400).json({
      success: false,
      error_code:
        error instanceof Error
          ? error.message
          : "UNKNOWN_ERROR"
    })
  }
},
async restore(
  req: Request,
  res: Response
) {

  try {

    const {
      restoreToken
    } =
      confirmRestoreSchema
        .parse(req.body)

    await RestoreService
      .restoreDatabase(
        restoreToken
      )

    return res.status(200).json({
      success: true,
      message:
        "Database restored successfully"
    })

  } catch (error) {

    return res.status(400).json({
      success: false,
      error_code:
        error instanceof Error
          ? error.message
          : "UNKNOWN_ERROR"
    })
  }
}
}
