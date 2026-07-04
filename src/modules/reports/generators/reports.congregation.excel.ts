import ExcelJS from "exceljs"

import type {
  CongregationReportPayload,
} from "../reports.type"


export const generateCongregationExcel =
async (
  data: CongregationReportPayload
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
        header: "Tanggal Lahir",
        key: "birthDate",
        width: 20
      },

      {
        header: "Telepon",
        key: "phone",
        width: 20
      },

      {
        header: "Alamat",
        key: "address",
        width: 40
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
            congregation.nik ?? "-",

          gender:
            congregation.gender ?? "-",

          birthDate:
            congregation.birthDate
              ?.toISOString()
              .split("T")[0] ?? "-",

          phone:
            congregation.phone ?? "-",

          address:
            congregation.address ?? "-",

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
        header: "Nama",
        key: "name",
        width: 30
      },

      {
        header: "Jumlah Kehadiran",
        key: "attendance",
        width: 20
      },

      {
        header: "Persentase",
        key: "percentage",
        width: 15
      },

      {
        header: "Terakhir Hadir",
        key: "lastAttendance",
        width: 20
      },

      {
        header: "Sesi Terakhir",
        key: "sessionTitle",
        width: 30
      },

      {
        header: "Jenis Sesi",
        key: "sessionType",
        width: 20
      },

      {
        header: "Metode Check In",
        key: "method",
        width: 20
      }
    ]

  data.congregations.forEach(
      congregation => {

        const attendanceCount =
          congregation.attendanceRecords.length

        const percentage =
          data.totalSessions === 0
            ? 0
            : Number(
                (
                  attendanceCount /
                  data.totalSessions *
                  100
                ).toFixed(2)
              )

        const latestRecord =
          congregation.attendanceRecords[0]

        attendanceSheet.addRow({

          name:
            congregation.fullName,

          attendance:
            attendanceCount,

          percentage:
            `${percentage}%`,

          lastAttendance:
            latestRecord?.checkInAt ?? "-",

          sessionTitle:
            latestRecord?.session
              ?.title ?? "-",

          sessionType:
            latestRecord?.session
              ?.type ?? "-",

          method:
            latestRecord?.method ?? "-"
        })
      }
    )

const summarySheet =
  workbook.addWorksheet(
    "Ringkasan"
  )

summarySheet.addRows([

  ["Metric", "Value"],

  [
    "Total Jamaah",
    data.congregations.length
  ],

  [
    "Total Mustahik",
    data.congregations.filter(
      c => c.isMustahik
    ).length
  ],

  [
    "Total Jamaah Aktif",
    data.congregations.filter(
      c => c.isActive
    ).length
  ],

  [
    "Total Sesi Kehadiran",
    data.totalSessions
  ],

  [
    "Total Record Kehadiran",
    data.totalAttendanceRecords
  ]
])

summarySheet.getRow(1).font = {
  bold: true
}

congregationSheet.views = [
  {
    state: "frozen",
    ySplit: 1
  }
]

mustahikSheet.views = [
  {
    state: "frozen",
    ySplit: 1
  }
]

attendanceSheet.views = [
  {
    state: "frozen",
    ySplit: 1
  }
]

congregationSheet.autoFilter = {
  from: "A1",
  to: "J1"
}

mustahikSheet.autoFilter = {
  from: "A1",
  to: "B1"
}

attendanceSheet.autoFilter = {
  from: "A1",
  to: "G1"
}

  attendanceSheet.getRow(1)
    .font = { bold: true }

  return workbook.xlsx.writeBuffer()
}