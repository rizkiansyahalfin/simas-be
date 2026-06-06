import { z } from "zod"

export const createSessionSchema =
  z.object({
    title:
      z.string().min(3),

    type:
      z.enum([
        "prayer",
        "event"
      ]),

    sessionDate:
      z.coerce.date(),

    startTime:
      z.coerce.date(),

    endTime:
      z.coerce.date()
      .optional(),

    notes:
      z.string()
      .optional(),
  })

export const checkInSchema =
  z.object({

    sessionId:
      z.number(),

    nik:
      z.string()
      .optional(),

    congregationId:
      z.number()
      .optional(),

    method:
      z.enum([
        "manual",
        "qr_code"
      ]),
  })