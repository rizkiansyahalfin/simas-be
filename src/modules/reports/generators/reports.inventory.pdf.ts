import PDFDocument from "pdfkit"

import type {
  InventoryReportPdfPayload
} from "../reports.type"

const formatDate = (
  value?: Date | null
) => {

  if (!value) {
    return "-"
  }

  return value.toLocaleDateString(
    "id-ID"
  )
}

export const generateInventoryPdf =
async (
  data: InventoryReportPdfPayload
) => {

  const doc =
    new PDFDocument({
      size: "A4",
      margin: 40
    })

  const buffers: Buffer[] = []

  doc.on(
    "data",
    chunk => buffers.push(chunk)
  )

  return new Promise<Buffer>(
    (resolve, reject) => {

      doc.on(
        "end",
        () =>
          resolve(
            Buffer.concat(buffers)
          )
      )

      doc.on(
        "error",
        reject
      )

      doc
        .fontSize(18)
        .text(
          "Laporan Inventaris Lengkap",
          {
            align: "center"
          }
        )

      doc.moveDown()

      doc.text(
        `Total Aset: ${data.totalAssets}`
      )

      doc.text(
        `Total Unit Barang: ${data.totalQuantity}`
      )

      doc.moveDown()

      doc.text("Ringkasan Kondisi")

      doc.text(
        `Baik: ${data.conditionSummary.baik}`
      )

      doc.text(
        `Rusak Ringan: ${data.conditionSummary.rusak_ringan}`
      )

      doc.text(
        `Rusak Berat: ${data.conditionSummary.rusak_berat}`
      )

      doc.text(
        `Hilang: ${data.conditionSummary.hilang}`
      )

      doc.moveDown()

      doc
        .fontSize(14)
        .text(
          "Daftar Inventaris",
          {
            underline: true
          }
        )

      doc.moveDown(0.5)

      data.inventories.forEach(
        item => {

          doc.fontSize(11)

          doc.text(
            `${item.itemCode} - ${item.itemName}`
          )

          doc.text(
            `Kategori: ${item.category.name}`
          )

          doc.text(
            `Qty: ${item.quantity}`
          )

          doc.text(
            `Kondisi: ${item.condition}`
          )

          doc.text(
            `PIC: ${item.manager.username ?? "-"}`
          )

          doc.moveDown(0.3)

          if (
            item.inventoryLoans.length
          ) {

            doc.text(
              "Riwayat Peminjaman:"
            )

            item.inventoryLoans.forEach(
              loan => {

                doc.text(
                  `• ${loan.borrowerName} | ${formatDate(loan.loanDate)} | ${loan.status}`
                )
              }
            )
          }

          doc.moveDown()
        }
      )

      doc.end()
    }
  )
}