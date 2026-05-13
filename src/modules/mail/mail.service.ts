import nodemailer from "nodemailer"
import type { MailPayload } from "./mail.type"

const host = process.env.MAIL_HOST
const port = Number(process.env.MAIL_PORT)
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS

if (!host || !port || !user || !pass) {
  throw new Error("Missing mail configuration in environment variables")
}

const transporter = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
})

export const MailService = {
  async sendMail({
    from = user,
    to,
    subject,
    html,
    cc,
    bcc
  }: MailPayload) {
    return transporter.sendMail({
      from,
      to,
      subject,
      html,
      cc,
      bcc
    })
  }
}