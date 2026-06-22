import { CongregationRepository } from "./congregation.repository"
import type {
  CongregationQueryInput,
  CreateCongregationInput,
  UpdateCongregationInput
} from "./congregation.validation"
import type { Gender } from "../../generated/enums"
import type { Prisma } from "../../generated/client"
import QRCode from "qrcode"
import ExcelJS from "exceljs"
import { parseExcelFile } from "./congregation.import"
import type {
  PaginatedCongregations,
  CongregationImportRow,
} from "./congregation.type"

export const CongregationService = {
  async getAll(query: CongregationQueryInput): Promise<PaginatedCongregations> {
    const skip = Math.max((query.page - 1) * query.limit, 0)

    return await CongregationRepository.findAll({
      search: query.search,
      gender: query.gender,
      isMustahik: query.isMustahik,
      skip,
      limit: query.limit
    })
  },

  async create(data: CreateCongregationInput) {
    return CongregationRepository.create(data)
  },

  async update(id: number, data: UpdateCongregationInput) {
    const existing = await CongregationRepository.findById(id)

    if (!existing) {
      throw new Error("CONGREGATION_NOT_FOUND")
    }

    return CongregationRepository.update(id, data)
  },

  async delete(id: number) {
    const existing = await CongregationRepository.findById(id)

    if (!existing) {
      throw new Error("CONGREGATION_NOT_FOUND")
    }

    return CongregationRepository.softDelete(id)
  },
  async generateQrCode(id: number) {
  const congregation =
    await CongregationRepository.findById(id)

  if (!congregation) {
    throw new Error("CONGREGATION_NOT_FOUND")
  }

  const qrCode =
    await QRCode.toDataURL(congregation.uuid)

  return {
    uuid: congregation.uuid,
    qrCode
  }
},

  async exportExcel() {
  const congregations =
    await CongregationRepository.findAllForExport()

  const workbook =
    new ExcelJS.Workbook()

  const worksheet =
    workbook.addWorksheet("Jamaah")

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Nama", key: "fullName", width: 30 },
    { header: "NIK", key: "nik", width: 25 },
    { header: "Telepon", key: "phone", width: 20 },
    { header: "Alamat", key: "address", width: 40 },
    { header: "Gender", key: "gender", width: 15 },
    { header: "Tanggal Lahir", key: "birthDate", width: 20 },
    { header: "Mustahik", key: "isMustahik", width: 15 },
    { header: "Aktif", key: "isActive", width: 15 },
  ]

  congregations.forEach((item) => {
    worksheet.addRow({
      id: item.id,
      fullName: item.fullName,
      nik: item.nik,
      phone: item.phone,
      address: item.address,
      gender: item.gender,
      birthDate: item.birthDate
        ? item.birthDate.toISOString().split("T")[0]
        : "",
      isMustahik: item.isMustahik
        ? "Ya"
        : "Tidak",
      isActive: item.isActive
        ? "Ya"
        : "Tidak",
    })
  })

  return workbook.xlsx.writeBuffer()
},

async importFile(filePath: string) {

  const rows =
    parseExcelFile(filePath)

  const successRows: Prisma.CongregationCreateManyInput[] = []
  const failedRows = []

  const importedRows = rows as CongregationImportRow[]

  for (let i = 0; i < importedRows.length; i++) {

    const row = importedRows[i]

    try {

      if (!row.fullName) {
        throw new Error(
          "fullName is required"
        )
      }

      successRows.push({
        fullName: row.fullName,
        nik: row.nik ?? null,
        address: row.address ?? null,
        phone: row.phone ?? null,
        gender: row.gender
          ? (row.gender as Gender)
          : null,
        isMustahik:
          row.isMustahik === true ||
          row.isMustahik === "true",
        birthDate:
          row.birthDate
            ? new Date(row.birthDate)
            : null
      })

    } catch (error) {

      failedRows.push({
        row: i + 2,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error"
      })
    }
  }

  if (successRows.length) {
    await CongregationRepository.createMany(
      successRows
    )
  }

  return {
    imported: successRows.length,
    failed: failedRows.length,
    errors: failedRows
  }
}
}
