import axios, { AxiosError } from "axios"
import type { PrayerData } from "./prayer.type"

export const PrayerProvider = {
  async fetch(city: string): Promise<PrayerData> {
    try {
      const res = await axios.get("API_URL", {
        params: { city },
        timeout: 5000
      })

      if (!res.data) {
        throw new Error("INVALID_RESPONSE")
      }

      return res.data
    } catch (err) {
      const axiosErr = err as AxiosError
      throw new Error(
        axiosErr.message || `Failed to fetch prayer data for ${city}`,
        { cause: err }
      )
    }
  }
}
