import PDFDocument from 'pdfkit'
import type { Donation } from '../../generated/client'
import type { MosqueProfile } from '../../generated/client'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const generateDonationCertificatePdf = async (
  donation: Donation & {
    category?: { name: string | null }
  },
  mosqueProfile?: MosqueProfile | null
) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 })
  const buffers: Buffer[] = []

  doc.on('data', (chunk) => buffers.push(chunk))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const title = mosqueProfile?.name ?? 'Masjid'
    const address = mosqueProfile?.address
    const email = mosqueProfile?.contactEmail
    const phone = mosqueProfile?.contactPhone

    doc.fontSize(16).text(title, { align: 'center' })
    doc.fontSize(10).text(address ?? '', { align: 'center' })
    doc.text(email ?? '', { align: 'center' })
    doc.text(phone ?? '', { align: 'center' })
    doc.moveDown(1.5)

    doc.fontSize(14).text('Sertifikat Donasi', { align: 'center' })
    doc.moveDown(1)

    doc.fontSize(11).text(`Nama Donatur: ${donation.donorName}`)
    doc.text(`Nominal Donasi: ${formatCurrency(Number(donation.amount))}`)
    doc.text(`Kategori Donasi: ${donation.category?.name ?? '-'}`)
    doc.text(`Tanggal Donasi: ${formatDate(donation.createdAt)}`)
    doc.text(`Status Donasi: ${donation.status.toUpperCase()}`)
    doc.moveDown(1)

    doc.fontSize(11).text('Terima kasih atas donasi Anda untuk mendukung kegiatan masjid.', {
      align: 'left',
    })

    doc.end()
  })
}
