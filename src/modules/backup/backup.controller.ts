import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { AppError } from "../../errors/app-error"
import { BackupService } from "./backup.service"
import { RestoreService } from "./restore.service"
import {  confirmRestoreSchema} from "./restore.validation"

export const BackupController = {
  createBackup: asyncHandler(async (req: Request, res: Response) => {
      const result = await BackupService.createBackup()

      return res.status(200).json({
        success: true,
        data: result
      })
  }),

  listBackups: asyncHandler(async (req: Request, res: Response) => {
      const backups = await BackupService.listBackups()

      return res.status(200).json({
        success: true,
        data: backups
      })
  }),

  deleteBackup: asyncHandler(async (req: Request, res: Response) => {
      const fileName = req.params.fileName

      if (!fileName || Array.isArray(fileName)) {
        throw new AppError(
          "FILENAME_REQUIRED",
          "Filename is required",
          400
        )
      }

      await BackupService.deleteBackup(fileName)

      return res.status(200).json({
        success: true,
        message: "Backup deleted successfully"
      })
  }),

  validateRestore: asyncHandler(async (
  req: Request,
  res: Response
) => {

    if (!req.file) {
      throw new AppError(
        "BACKUP_FILE_REQUIRED",
        "Backup file is required",
        400
      )
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
}),

restore: asyncHandler(async (
  req: Request,
  res: Response
) => {

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
})
}