export interface PrayerApiResponse {
  code: number
  message: string
  data: {
    provinsi: string
    kabkota: string
    bulan: number
    tahun: number
    bulan_nama: string
    jadwal: PrayerScheduleItem[]
  }
}

export interface PrayerScheduleItem {
  tanggal: number
  tanggal_lengkap: string
  hari: string
  imsak: string
  subuh: string
  terbit: string
  dhuha: string
  dzuhur: string
  ashar: string
  maghrib: string
  isya: string
}

export interface PrayerConfig {
  province: string
  city: string
}