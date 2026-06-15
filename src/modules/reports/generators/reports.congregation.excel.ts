import ExcelJS from "exceljs"

import type {
  CongregationReportData,
  MustahikStatistic,
  AttendanceStatistic
} from "../reports.type"

type Payload = {
  congregations: CongregationReportData[]
  mustahikStats: MustahikStatistic[]
  attendanceStats: AttendanceStatistic[]
}

export const generateCongregationExcel =
async (
  data: Payload
) => {

  const workbook =
    new ExcelJS.Workbook()

  /*
   * Sheet 1
   * DATA JAMAAH
   */

  const congregationSheet =
    workbook.addWorksheet(
      "Jamaah"
    )

  congregationSheet.columns = [

    {
      header: "ID",
      key: "id",
      width: 10
    },

    {
      header: "Nama",
      key: "name",
      width: 30
    },

    {
      header: "NIK",
      key: "nik",
      width: 25
    },

    {
      header: "Gender",
      key: "gender",
      width: 15
    },

    {
      header: "Telepon",
      key: "phone",
      width: 20
    },

    {
      header: "Mustahik",
      key: "mustahik",
      width: 15
    },

    {
      header: "Kategori Mustahik",
      key: "category",
      width: 20
    },

    {
      header: "Status Aktif",
      key: "active",
      width: 15
    }
  ]

  data.congregations.forEach(
    congregation => {

      congregationSheet.addRow({

        id:
          congregation.id,

        name:
          congregation.fullName,

        nik:
          congregation.nik,

        gender:
          congregation.gender,

        phone:
          congregation.phone,

        mustahik:
          congregation.isMustahik
            ? "Ya"
            : "Tidak",

        category:
          congregation.mustahik
            ?.category ?? "-",

        active:
          congregation.isActive
            ? "Aktif"
            : "Nonaktif"
      })
    }
  )

  congregationSheet.getRow(1)
    .font = { bold: true }

  /*
   * Sheet 2
   * MUSTAHIK STATISTICS
   */

  const mustahikSheet =
    workbook.addWorksheet(
      "Statistik Mustahik"
    )

  mustahikSheet.columns = [

    {
      header: "Kategori",
      key: "category",
      width: 25
    },

    {
      header: "Jumlah",
      key: "count",
      width: 15
    }
  ]

  data.mustahikStats.forEach(
    stat => {

      mustahikSheet.addRow({

        category:
          stat.category,

        count:
          stat._count.category
      })
    }
  )

  mustahikSheet.getRow(1)
    .font = { bold: true }

  /*
   * Sheet 3
   * ATTENDANCE
   */

  const attendanceSheet =
    workbook.addWorksheet(
      "Kehadiran"
    )

  attendanceSheet.columns = [

    {
      header: "ID Jamaah",
      key: "id",
      width: 15
    },

    {
      header: "Nama",
      key: "name",
      width: 30
    },

    {
      header: "Total Kehadiran",
      key: "attendance",
      width: 20
    }
  ]

  data.congregations.forEach(
    congregation => {

      const attendance =
        data.attendanceStats.find(
          item =>
            item.congregationId ===
            congregation.id
        )

      attendanceSheet.addRow({

        id:
          congregation.id,

        name:
          congregation.fullName,

        attendance:
          attendance?._count
            .congregationId ?? 0
      })
    }
  )

  attendanceSheet.getRow(1)
    .font = { bold: true }

  return workbook.xlsx.writeBuffer()
}