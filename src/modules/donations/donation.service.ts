// donation.service.ts

import { DonationRepository } from './donation.repository'

import type {
  CreateDonationInput,
  GetDonationsQuery,
} from './donation.type'

import {
  NotificationTrigger,
} from '../notification/notification.trigger'

import {
  getCampaignProgress,
} from '../campaign/campaign.service'

export const DonationService = {
  async getAll({
  status,
  categoryId,
  page,
  limit,
}: GetDonationsQuery) {

    const skip =
      (page - 1) * limit

    return DonationRepository.findAll({
      status,
      skip,
      limit,
      categoryId,
    })
  },

  async submit(
    data: CreateDonationInput,
    file?: Express.Multer.File
  ) {

    const donation =
      await DonationRepository.create({
        donorName: data.donorName,
        phone: data.phone,
        amount: data.amount,
        categoryId: data.categoryId,
        proofImageUrl: file?.filename,
        status: 'pending',
      })

    await NotificationTrigger.donationCreated({
      donationId: donation.id,
      donorName: donation.donorName,
      amount: donation.amount.toNumber(),
    })

    return donation
  },

  async getPublicStats() {
  return DonationRepository.getPublicStats()
  },

  async verify(
    id: number,
    userId: number
  ) {

    const donation =
      await DonationRepository.findById(id)

    if (!donation) {
      throw new Error(
        'DONATION_NOT_FOUND'
      )
    }

    if (
      donation.status !== 'pending'
    ) {
      throw new Error(
        'DONATION_INVALID_STATUS'
      )
    }

    const updatedDonation =
      await DonationRepository.update(
        id,
        {
          status: 'verified',
          verifiedBy: userId,
          verifiedAt: new Date(),
        }
      )

    await NotificationTrigger.donationVerified({
      donationId:
        updatedDonation.id,

      donorName:
        updatedDonation.donorName,
    })

    if (
      updatedDonation.campaignId
    ) {

      const progress =
        await getCampaignProgress(
          updatedDonation.campaignId
        )

      if (
        progress &&
        progress.collectedAmount >=
          progress.targetAmount
      ) {

        await NotificationTrigger.campaignReached({
          campaignId:
            progress.campaignId,

          campaignTitle:
            progress.title,
        })
      }
    }

    return updatedDonation
  },

  async reject(
    id: number,
    userId: number,
    note: string
  ) {

    const donation =
      await DonationRepository.findById(id)

    if (!donation) {
      throw new Error(
        'DONATION_NOT_FOUND'
      )
    }

    if (
      donation.status !== 'pending'
    ) {
      throw new Error(
        'DONATION_INVALID_STATUS'
      )
    }

    return DonationRepository.update(
      id,
      {
        status: 'rejected',
        verifiedBy: userId,
        verifiedAt: new Date(),
        rejectionNote: note,
      }
    )
  },
}