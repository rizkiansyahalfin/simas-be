import ExcelJS from "exceljs"
import type { CashTransaction } from "../../../generated/client"
import type { InventoryReport, DonationReport } from "../reports.type"

export const generateInventoryExcel = async (inventories: InventoryReport[]) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Inventory Report")

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Item Code", key: "itemCode", width: 20 },
    { header: "Item Name", key: "itemName", width: 30 },
    { header: "Category", key: "category", width: 20 },
    { header: "Quantity", key: "quantity", width: 15 },
    { header: "Condition", key: "condition", width: 20 },
    { header: "Manager", key: "manager", width: 20 }
  ]

  worksheet.views = [{ state: "frozen", ySplit: 1 }]
  worksheet.autoFilter = { from: "A1", to: "F1" }

  worksheet.getRow(1).font = { bold: true }

  inventories.forEach((item) => {
    worksheet.addRow({
      id: item.id,
      itemCode: item.itemCode,
      itemName: item.itemName,
      category: item.categoryId,
      quantity: item.quantity,
      condition: item.condition,
      manager: item.manager?.username ?? "-"
    })
  })

  return workbook.xlsx.writeBuffer()
}

export const generateFinanceExcel = async (transactions: CashTransaction[]) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Finance Weekly Report")

  worksheet.columns = [
    { header: "Date", key: "date", width: 20 },
    { header: "Type", key: "type", width: 15 },
    { header: "Category", key: "category", width: 20 },
    {
      header: "Amount",
      key: "amount",
      width: 20,
      style: { numFmt: '"Rp"#,##0.00' }
    },
    { header: "Description", key: "description", width: 40 }
  ]

  worksheet.views = [{ state: "frozen", ySplit: 1 }]
  worksheet.autoFilter = { from: "A1", to: "F1" }

  worksheet.getRow(1).font = { bold: true }

  transactions.forEach((trx) => {
    worksheet.addRow({
      date: trx.transactionDate,
      type: trx.type,
      category: trx.category,
      amount: Number(trx.amount),
      description: trx.description
    })
  })

  return workbook.xlsx.writeBuffer()
}

export const generateDonationsExcel =
async (
  donations: DonationReport[]
) => {

  const workbook =
    new ExcelJS.Workbook()

  const sheet =
    workbook.addWorksheet(
      "Donations"
    )

  sheet.columns = [

    {
      header: "Tanggal",
      key: "date",
      width: 18
    },

    {
      header: "Donatur",
      key: "donor",
      width: 30
    },

    {
      header: "Telepon",
      key: "phone",
      width: 20
    },

    {
      header: "Kategori",
      key: "category",
      width: 25
    },

    {
      header: "Campaign",
      key: "campaign",
      width: 35
    },

    {
      header: "Status",
      key: "status",
      width: 15
    },

    {
      header: "Nominal",
      key: "amount",
      width: 20
    }
  ]

  donations.forEach(
    (
      donation: DonationReport
    ) => {

      sheet.addRow({
        date: donation.createdAt,
        donor: donation.donorName,
        phone: donation.phone,
        category: donation.category?.name ?? "-",
        campaign: donation.campaign?.title ?? "-",
        status: donation.status,
        amount: Number( donation.amount )
      })
    }
  )

  sheet.getRow(1)
    .font = {
      bold: true
    }

const total =
  donations.reduce(
    ( sum: number, donation: DonationReport ) => sum + Number( donation.amount ), 
    0
  )

  sheet.addRow([])

  sheet.addRow({
    donor: "TOTAL",
    amount: total
  })

  return workbook.xlsx.writeBuffer()
}
