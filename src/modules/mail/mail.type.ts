export type MailPayload = {
  to: string
  subject: string
  html: string
  from?: string
  cc?: string | string[]
  bcc?: string | string[]
}

export type DonationVerifiedTemplateProps = {
  donorName: string
  amount: number
}