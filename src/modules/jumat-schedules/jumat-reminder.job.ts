import cron from "node-cron"

import {
  addDays,
} from "date-fns"

import {
  getByDate,
} from "./jumat-schedule.service"

import {
  NotificationTrigger,
} from "../notification/notification.trigger"

export const startJumatReminderJob = () => {

  // Kamis jam 21:00

  cron.schedule(
    "0 21 * * 4",
    async () => {

      console.log(
        "Running Jumat reminder job..."
      )

      try {

        const tomorrow =
          addDays(new Date(), 1)

        tomorrow.setHours(
          0,
          0,
          0,
          0
        )

        const schedule =
          await getByDate(
            tomorrow
          )

        if (!schedule) {

          console.log(
            "No Jumat schedule found for tomorrow"
          )

          return
        }

        await NotificationTrigger.jumatReminder({
          jumatDate:
            schedule.jumatDate,

          imam:
            schedule.imam,

          khatib:
            schedule.khatib,

          muadzin:
            schedule.muadzin,
        })

        console.log(
          "Jumat reminder notification sent"
        )

      } catch (err) {

        console.error(
          "Jumat reminder job failed:",
          err
        )
      }
    }
  )
}