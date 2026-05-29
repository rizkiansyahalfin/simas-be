import type { SendMailOptions } from "nodemailer"

export type MailPayload = Pick<
  SendMailOptions,
  "from" | "to" | "subject" | "html" | "cc" | "bcc"
>

export type DonationVerifiedTemplateProps = {
  donorName: string
  amount: number
}

export type ResetPasswordTemplateProps = {
  recipientName: string
  resetUrl: string
  expiresInMinutes?: number
}
