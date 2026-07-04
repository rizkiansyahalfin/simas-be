import axios from "axios"
import type { PrayerApiResponse } from "./prayer.type"

const BASE_URL = "https://equran.id/api/v2/shalat"

export const PrayerProvider = {
  async getProvinces(): Promise<string[]> {
    const res = await axios.get(`${BASE_URL}/provinsi`)
    return res.data.data
  },

  async getCities(province: string): Promise<string[]> {
    const res = await axios.post(`${BASE_URL}/kabkota`, {
      provinsi: province
    })

    return res.data.data
  },

  async fetchMonthlySchedule(
    province: string,
    city: string,
    month: number,
    year: number
  ): Promise<PrayerApiResponse["data"]> {

    const res = await axios.post<PrayerApiResponse>(
      BASE_URL,
      {
        provinsi: province,
        kabkota: city,
        bulan: month,
        tahun: year
      },
      {
        timeout: 10000
      }
    )

    return res.data.data
  }
}