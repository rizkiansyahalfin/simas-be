// notification.trigger.ts

import prisma from '../../database'

import {
  NotificationType,
} from '../../generated/enums'

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
    borrowerPhone,
    expectedReturnDate,
  }: {
    loanId: number
    borrowerName: string
    borrowerPhone?: string | null
    expectedReturnDate?: Date
  }) {

    if (expectedReturnDate) {
      const dueDateText = expectedReturnDate.toLocaleDateString('id-ID')

      await NotificationService.push({
        title: 'Peminjaman Overdue',
        message: `Halo ${borrowerName}, peminjaman Anda telah melewati batas pengembalian pada ${dueDateText}. Mohon segera kembalikan barang yang dipinjam.`,
        type: 'inventory',
        entityId: String(loanId),
        entityType: 'inventory-loan',
        uniqueKey: `inventory-overdue-borrower-${loanId}`,
      })

      await NotificationService.push({
        title: 'Peminjaman Overdue',
        message: `Peminjaman oleh ${borrowerName}${borrowerPhone ? ` (${borrowerPhone})` : ''} telah melewati batas pengembalian pada ${dueDateText}.`,
        type: 'system',
        entityId: String(loanId),
        entityType: 'inventory-loan',
        uniqueKey: `inventory-overdue-admin-${loanId}`,
      })
    } else {
      await NotificationService.push({
        title: 'Peminjaman Overdue',
        message: `Peminjaman oleh ${borrowerName} telah melewati batas pengembalian.`,
        type: 'system',
        entityId: String(loanId),
        entityType: 'inventory-loan',
        uniqueKey: `inventory-overdue-admin-${loanId}`,
      })
    }
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

  async jumatReminder(data: {
    jumatDate: Date
    imam?: string | null
    khatib?: string | null
    muadzin?: string | null
  }) {

    const admins = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    })

    if (!admins.length) {
      return
    }

    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,

        title: "Reminder Jadwal Jumat",

        message:
          `Jadwal Jumat besok:\n` +
          `Imam: ${data.imam ?? "-"}\n` +
          `Khatib: ${data.khatib ?? "-"}\n` +
          `Muadzin: ${data.muadzin ?? "-"}`,

        type: NotificationType.system,
      })),
    })
  },
}