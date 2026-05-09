import { DonationRepository } from './donation.repository'
import type { CreateDonationInput, VerifyDonationInput } from './donation.validation'
import { transporter } from '../../utils/mailer'
import {
  donationReceivedTemplate,
  donationVerifiedTemplate,
  donationRejectedTemplate,
} from '../../utils/email-templates'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const BENDAHARA_EMAIL = process.env.BENDAHARA_EMAIL!

const formatAmount = (amount: { toString(): string } | number | string) =>
  Number(amount.toString()).toLocaleString('id-ID')

const formatDate = (date: Date) =>
  format(date, 'dd MMMM yyyy, HH:mm', { locale: id })

export const DonationService = {
  async create(data: CreateDonationInput) {
    const donation = await DonationRepository.create(data)

    const template = donationReceivedTemplate({
      donorName: donation.donorName,
      amount: formatAmount(donation.amount),
      category: donation.category,
      createdAt: formatDate(donation.createdAt),
    })

    await transporter.sendMail({
      from: `"SIMAS Masjid" <${process.env.GMAIL_USER}>`,
      to: BENDAHARA_EMAIL,
      subject: template.subject,
      html: template.html,
    })

    return donation
  },

  async verify(id: number, verifiedBy: number, data: VerifyDonationInput) {
    const donation = await DonationRepository.verify(
      id,
      verifiedBy,
      data.status,
      data.rejectionNote
    )

    if (data.donorEmail) {
      if (data.status === 'verified') {
        const template = donationVerifiedTemplate({
          donorName: donation.donorName,
          amount: formatAmount(donation.amount),
          category: donation.category,
          verifiedAt: formatDate(donation.verifiedAt!),
        })
        await transporter.sendMail({
          from: `"SIMAS Masjid" <${process.env.GMAIL_USER}>`,
          to: data.donorEmail,
          subject: template.subject,
          html: template.html,
        })
      } else {
        const template = donationRejectedTemplate({
          donorName: donation.donorName,
          amount: formatAmount(donation.amount),
          rejectionNote: data.rejectionNote!,
        })
        await transporter.sendMail({
          from: `"SIMAS Masjid" <${process.env.GMAIL_USER}>`,
          to: data.donorEmail,
          subject: template.subject,
          html: template.html,
        })
      }
    }

    return donation
  },

  async findAll() {
    return DonationRepository.findAll()
  },

  async findById(id: number) {
    return DonationRepository.findById(id)
  },
}