import { DonationRepository } from './donation.repository'
import type { CreateDonationInput, GetDonationsQuery } from './donation.type'

export const DonationService = {
  async getAll({ status, page, limit }: GetDonationsQuery) {
    const skip = (page - 1) * limit

    return DonationRepository.findAll({
      status,
      skip,
      limit,
    })
  },

  async submit(data: CreateDonationInput, file?: Express.Multer.File) {
    return DonationRepository.create({
      donorName: data.donorName,
      phone: data.phone,
      amount: data.amount,
      category: data.category,
      proofImageUrl: file?.filename,
      status: 'pending',
    })
  },

  async verify(id: number, userId: number) {
    const donation = await DonationRepository.findById(id)

    if (!donation) {
      throw new Error('DONATION_NOT_FOUND')
    }

    if (donation.status !== 'pending') {
      throw new Error('DONATION_INVALID_STATUS')
    }

    return DonationRepository.update(id, {
      status: 'verified',
      verifiedBy: userId,
      verifiedAt: new Date(),
    })
  },

  async reject(id: number, userId: number, note: string) {
    const donation = await DonationRepository.findById(id)

    if (!donation) {
      throw new Error('DONATION_NOT_FOUND')
    }

    if (donation.status !== 'pending') {
      throw new Error('DONATION_INVALID_STATUS')
    }

    return DonationRepository.update(id, {
      status: 'rejected',
      verifiedBy: userId,
      verifiedAt: new Date(),
      rejectionNote: note,
    })
  },
}