import { z } from "zod"

export const confirmRestoreSchema =
  z.object({
    restoreToken:
      z.string().uuid(),

    confirmation:
      z.literal(
        "RESTORE_DATABASE"
      )
  })