import fs from "fs"
import crypto from "crypto"
import zlib from "zlib"
import { pipeline } from "stream/promises"
import { spawn, execSync } from "child_process"

import redis from "../../lib/redis"

import {
  RestoreMetadata,
  ValidateRestoreResponse
} from "./restore.type"

const REDIS_TTL_SECONDS = 600

const RESTORE_PREFIX =
  "restore:confirm:"

const GZIP_SIGNATURE = Buffer.from([0x1f, 0x8b])

function isGzipFile(filePath: string): boolean {
  const buffer = Buffer.alloc(2)
  const fd = fs.openSync(filePath, "r")
  fs.readSync(fd, buffer, 0, 2, 0)
  fs.closeSync(fd)

  return buffer.equals(GZIP_SIGNATURE)
}

async function readFirstLinesFromGzip(
  filePath: string,
  maxLines = 50
): Promise<string> {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath)
    const gunzip = zlib.createGunzip()
    let content = ""
    let finished = false

    const cleanup = (): void => {
      finished = true
      readStream.destroy()
      gunzip.destroy()
    }

    gunzip.on("data", (chunk) => {
      if (finished) {
        return
      }

      content += chunk.toString("utf8")
      const lines = content.split(/\r?\n/)

      if (lines.length >= maxLines) {
        cleanup()
        resolve(lines.slice(0, maxLines).join("\n"))
      }
    })

    gunzip.on("end", () => {
      if (!finished) {
        resolve(content)
      }
    })

    gunzip.on("error", reject)
    readStream.on("error", reject)

    readStream.pipe(gunzip)
  })
}

function validatePsqlAvailable(): void {
  try {
    execSync("psql --version", { stdio: "pipe" })
  } catch {
    throw new Error("PSQL_NOT_AVAILABLE")
  }
}

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
      !file.originalname
        .toLowerCase()
        .endsWith(
          ".sql.gz"
        )
    ) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }

      throw new Error(
        "INVALID_BACKUP_FORMAT"
      )
    }

    if (!isGzipFile(file.path)) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }

      throw new Error(
        "INVALID_GZIP_FILE"
      )
    }

    const sqlPreview = await readFirstLinesFromGzip(
      file.path,
      50
    )

    if (!sqlPreview) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }

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
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }

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

    validatePsqlAvailable()

    const psqlProcess = spawn(
      "psql",
      ["-d", databaseUrl],
      {
        stdio: ["pipe", "inherit", "inherit"]
      }
    )

    try {
      await pipeline(
        fs.createReadStream(metadata.filePath),
        zlib.createGunzip(),
        psqlProcess.stdin
      )
    } catch {
      psqlProcess.kill()
      throw new Error(
        "DATABASE_RESTORE_FAILED"
      )
    }

    const exitCode = await new Promise<number>(
      (resolve, reject) => {
        psqlProcess.on("close", resolve)
        psqlProcess.on("error", reject)
      }
    )

    if (exitCode !== 0) {
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