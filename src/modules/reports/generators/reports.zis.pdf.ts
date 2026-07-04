import PDFDocument from 'pdfkit'
import type { ZisReportPdfPayload } from '../reports.type'

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

export const generateZisMonthlyPdf = async (
  data: ZisReportPdfPayload
) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 })
  const buffers: Buffer[] = []

  doc.on('data', (chunk) => buffers.push(chunk))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    doc.fontSize(18).text('Laporan Rekap ZIS Bulanan', {
      align: 'center',
    })
    doc.moveDown(0.5)

    doc.fontSize(12).text(`Periode: ${String(data.month).padStart(2, '0')}/${data.year}`)
    doc.text(`Total Penerimaan ZIS: ${formatCurrency(data.totalReceipts)}`)
    doc.text(`Total Penyaluran: ${formatCurrency(data.totalDistributions)}`)
    const balance = data.totalReceipts -  data.totalDistributions
    doc.text( `Saldo ZIS: ${formatCurrency(balance)}`)
    doc.moveDown()
    doc.fontSize(14).text(
        "Rekap Penerimaan per Kategori", {underline: true})
    doc.moveDown(0.5)
        if ( data.categoryReceipts.length === 0 ) {
    doc.fontSize(11).text("Tidak ada data penerimaan")
      } else {
        data.categoryReceipts.forEach(( item ) => {
            doc.fontSize(11).text(
                `${item.category}: ${formatCurrency(item.amount)}`
              )}
            )
    }
    doc.moveDown(1)

    doc.fontSize(14).text('Rincian Penerimaan ZIS', { underline: true })
    doc.moveDown(0.5)

    if (data.zisTransactions.length === 0) {
      doc.fontSize(11).text('Tidak ada penerimaan ZIS untuk periode ini.')
    } else {
      data.zisTransactions.forEach((transaction, index) => {
        doc.fontSize(11).text(
          `${index + 1}. ${formatDate(transaction.transactionDate)} · ${transaction.zisCategory} · ${formatCurrency(Number(transaction.amount))}`
        )
      })
    }

    doc.moveDown(1)
    doc.fontSize(14).text('Total Penyaluran per Kategori Mustahik', {
      underline: true,
    })
    doc.moveDown(0.5)

    if (data.categoryDistributions.length === 0) {
      doc.fontSize(11).text('Tidak ada penyaluran untuk periode ini.')
    } else {
      data.categoryDistributions.forEach((item) => {
        doc.fontSize(11).text(
          `${item.category}: ${formatCurrency(item.amount)}`
        )
      })
    }

    doc.end()
  })
}
