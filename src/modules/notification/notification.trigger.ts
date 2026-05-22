// notification.trigger.ts

import {
  NotificationService,
} from './notification.service'

export const NotificationTrigger = {
  async donationCreated({
    donationId,
    donorName,
    amount,
  }: {
    donationId: number
    donorName: string
    amount: number
  }) {

    await NotificationService.push({
      title: 'Donasi Baru',

      message:
        `${donorName} berdonasi sebesar Rp${amount.toLocaleString('id-ID')}`,

      type: 'donation',

      entityId: String(donationId),
      entityType: 'donation',
    })
  },

  async donationVerified({
    donationId,
    donorName,
  }: {
    donationId: number
    donorName: string
  }) {

    await NotificationService.push({
      title: 'Donasi Diverifikasi',

      message:
        `Donasi dari ${donorName} telah diverifikasi.`,

      type: 'donation',

      entityId: String(donationId),
      entityType: 'donation',
    })
  },

  async campaignReached({
    campaignId,
    campaignTitle,
  }: {
    campaignId: number
    campaignTitle: string
  }) {

    await NotificationService.push({
      title:
        'Target Campaign Tercapai',

      message:
        `Campaign ${campaignTitle} telah mencapai target.`,

      type: 'campaign',

      entityId: String(campaignId),
      entityType: 'campaign',

      uniqueKey:
        `campaign-reached-${campaignId}`,
    })
  },

  async inventoryOverdue({
    loanId,
    borrowerName,
  }: {
    loanId: number
    borrowerName: string
  }) {

    await NotificationService.push({
      title:
        'Peminjaman Overdue',

      message:
        `Peminjaman oleh ${borrowerName} telah melewati batas pengembalian.`,

      type: 'inventory',

      entityId: String(loanId),
      entityType: 'inventory-loan',

      uniqueKey:
        `inventory-overdue-${loanId}`,
    })
  },

  async eventReminder({
    eventId,
    eventTitle,
  }: {
    eventId: number
    eventTitle: string
  }) {

    await NotificationService.push({
      title:
        'Pengingat Kegiatan',

      message:
        `Kegiatan ${eventTitle} akan dimulai besok.`,

      type: 'event',

      entityId: String(eventId),
      entityType: 'event',

      uniqueKey:
        `event-reminder-${eventId}`,
    })
  },
}