import PDFDocument from "pdfkit"
import type { FinancePdfPayload } from "./reports.type"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value)

const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

export const generateFinancePdf = async (data: FinancePdfPayload) => {
  const doc = new PDFDocument({ size: "A4", margin: 40 })
  const buffers: Buffer[] = []

  doc.on("data", (chunk) => buffers.push(chunk))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)))
    doc.on("error", reject)

    doc.fontSize(20).text("Laporan Keuangan Bulanan", { align: "center" })
    doc.moveDown(0.5)

    doc.fontSize(12).text(`Periode: ${String(data.month).padStart(2, "0")}/${data.year}`)
    doc.moveDown(0.5)

    doc.fontSize(12).text(`Total Pendapatan: ${formatCurrency(data.totalIncome)}`)
    doc.text(`Total Pengeluaran: ${formatCurrency(data.totalExpense)}`)
    doc.text(`Saldo Bersih: ${formatCurrency(data.balance)}`)
    doc.moveDown(1.2)

    doc.fontSize(14).text("Transaksi Kas", { underline: true })
    doc.moveDown(0.4)

    if (data.cashTransactions.length === 0) {
      doc.fontSize(11).text("Tidak ada transaksi kas untuk periode ini.")
    } else {
      data.cashTransactions.forEach((transaction, index) => {
        doc.fontSize(11).text(
          `${index + 1}. ${formatDate(transaction.transactionDate)} · ${transaction.category} · ${transaction.type.toUpperCase()} · ${formatCurrency(Number(transaction.amount))}`
        )
      })
    }

    doc.moveDown(1)
    doc.fontSize(14).text("Transaksi ZIS", { underline: true })
    doc.moveDown(0.4)

    if (data.zisTransactions.length === 0) {
      doc.fontSize(11).text("Tidak ada transaksi ZIS untuk periode ini.")
    } else {
      data.zisTransactions.forEach((transaction, index) => {
        doc.fontSize(11).text(
          `${index + 1}. ${formatDate(transaction.transactionDate)} · ${transaction.type.toUpperCase()} · ${formatCurrency(Number(transaction.amount))}`
        )
      })
    }

    doc.end()
  })
}