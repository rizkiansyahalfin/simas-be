import nodemailer from "nodemailer"
import type { MailPayload } from "./mail.type"

const mailHost = process.env.MAIL_HOST
const mailPort = Number(process.env.MAIL_PORT)
const mailUser = process.env.MAIL_USER
const mailPass = process.env.MAIL_PASS

const validateMailConfig = () => {
  if (!mailHost || Number.isNaN(mailPort) || !mailUser || !mailPass) {
    throw new Error(
      "Missing or invalid mail configuration. Please set MAIL_HOST, MAIL_PORT, MAIL_USER, and MAIL_PASS."
    )
  }
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

const getTransporter = () => {
  if (transporter) {
    return transporter
  }

  validateMailConfig()

  transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailPort === 465,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  })

  return transporter
}

export const MailService = {
  async sendMail(payload: MailPayload) {
    const { from = mailUser, ...mailOptions } = payload
    return getTransporter().sendMail({ from, ...mailOptions })
  },
}
