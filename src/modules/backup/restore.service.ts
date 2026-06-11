import fs from "fs"
import crypto from "crypto"
import { execSync } from "child_process"
import { promisify } from "util"

import redis from "../../lib/redis"

import {
  RestoreMetadata,
  ValidateRestoreResponse
} from "./restore.type"

const REDIS_TTL_SECONDS = 600

const RESTORE_PREFIX =
  "restore:confirm:"

export const RestoreService = {

  async validateBackup(
    file: Express.Multer.File
  ): Promise<ValidateRestoreResponse> {

    if (!file) {
      throw new Error(
        "BACKUP_FILE_REQUIRED"
      )
    }

    if (
      !file.originalname.endsWith(
        ".sql.gz"
      )
    ) {
      throw new Error(
        "INVALID_BACKUP_FORMAT"
      )
    }

    try {

      execSync(
        `gunzip -t "${file.path}"`
      )

    } catch {

      throw new Error(
        "INVALID_GZIP_FILE"
      )
    }

    let sqlPreview = ""

    try {

      sqlPreview =
        execSync(
          `gunzip -c "${file.path}" | head -n 50`
        ).toString()

        console.log(sqlPreview)

    } catch {

      throw new Error(
        "INVALID_SQL_DUMP"
      )
    }

    const isValidSqlDump =
      sqlPreview.includes(
        "PostgreSQL database dump"
      ) ||
      sqlPreview.includes(
        "CREATE TABLE"
      ) ||
      sqlPreview.includes(
        "ALTER TABLE"
      ) ||
      sqlPreview.includes(
        "INSERT INTO"
      )

    if (!isValidSqlDump) {
      throw new Error(
        "INVALID_SQL_DUMP"
      )
    }

    const restoreToken =
      crypto.randomUUID()

    const metadata: RestoreMetadata = {
      filePath: file.path,
      originalName:
        file.originalname,
      createdAt:
        new Date().toISOString()
    }

    await redis.set(
      `${RESTORE_PREFIX}${restoreToken}`,
      JSON.stringify(metadata),
      "EX",
      REDIS_TTL_SECONDS
    )

    return {
      restoreToken,
      fileName:
        file.originalname,
      expiresIn:
        REDIS_TTL_SECONDS
    }
  },

  async restoreDatabase(
    restoreToken: string
  ) {

    const key =
      `${RESTORE_PREFIX}${restoreToken}`

    const raw =
      await redis.get(key)

    if (!raw) {
      throw new Error(
        "RESTORE_CONFIRMATION_EXPIRED"
      )
    }

    const metadata =
      JSON.parse(
        raw
      ) as RestoreMetadata

    const databaseUrl =
      process.env.DATABASE_URL

    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL_MISSING"
      )
    }

    try {

      execSync(
        `gunzip -c "${metadata.filePath}" | psql "${databaseUrl}"`,
        {
          stdio:
            "inherit"
        }
      )

    } catch {

      throw new Error(
        "DATABASE_RESTORE_FAILED"
      )
    }

    if (
      fs.existsSync(
        metadata.filePath
      )
    ) {

      fs.unlinkSync(
        metadata.filePath
      )
    }

    await redis.del(key)

    return {
      success: true
    }
  }
}