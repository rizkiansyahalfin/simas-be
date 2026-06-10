import { z } from "zod"

export const deleteBackupSchema = z.object({
  fileName: z
    .string()
    .min(1, "Filename is required")
    .regex(/^backup-[\d-]+\.sql\.gz$/, "Invalid backup filename format")
})
