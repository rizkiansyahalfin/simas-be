import { PrayerProvider } from "./prayer.provider";
import { PrayerRepository } from "./prayer.repository";
import { prayerConfig, updatePrayerConfig } from "./prayer.config";
import { prayerScheduleSchema } from "./prayer.validation";
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const parsePrayerDate = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error("INVALID_PRAYER_DATE");
    }
    parsed.setHours(0, 0, 0, 0);
    return parsed;
};
const convertPrayerTime = (time) => {
    const clean = time.trim().split(" ")[0];
    const parsed = new Date(`1970-01-01T${clean}:00`);
    if (Number.isNaN(parsed.getTime())) {
        throw new Error("INVALID_PRAYER_TIME");
    }
    return parsed;
};
const convertToPrayerDate = (value) => {
    if (value instanceof Date)
        return value;
    if (typeof value === "string") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed;
        }
        return convertPrayerTime(value);
    }
    throw new Error("INVALID_PRAYER_TIME");
};
const normalizeCity = (city) => city?.trim() || prayerConfig.city;
export const PrayerService = {
    async getPrayer(date, city) {
        const prayerDate = parsePrayerDate(date);
        const normalizedCity = normalizeCity(city);
        return PrayerRepository.findByDate(prayerDate, normalizedCity);
    },
    async updateConfig(payload) {
        return updatePrayerConfig(payload);
    },
    async syncToday() {
        const city = prayerConfig.city;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await PrayerRepository.findByDate(today, city);
        if (existing) {
            console.log(`Prayer data already synced for ${city} on ${today.toISOString().slice(0, 10)}`);
            return existing;
        }
        const data = await this.fetchWithRetry(city);
        const payload = prayerScheduleSchema.parse({
            prayerDate: today,
            city,
            subuh: convertToPrayerDate(data.subuh),
            dzuhur: convertToPrayerDate(data.dzuhur),
            ashar: convertToPrayerDate(data.ashar),
            maghrib: convertToPrayerDate(data.maghrib),
            isya: convertToPrayerDate(data.isya)
        });
        return PrayerRepository.upsert(payload);
    },
    async fetchWithRetry(city, attempt = 1) {
        try {
            return await PrayerProvider.fetch(city);
        }
        catch (err) {
            if (attempt >= MAX_RETRY_ATTEMPTS) {
                console.error(`Failed to fetch prayer data for ${city} after ${MAX_RETRY_ATTEMPTS} attempts:`, err);
                throw new Error("FAILED_FETCH_PRAYER", { cause: err });
            }
            console.warn(`Attempt ${attempt}/${MAX_RETRY_ATTEMPTS} failed, retrying in ${RETRY_DELAY_MS}ms...`, err);
            await sleep(RETRY_DELAY_MS);
            return this.fetchWithRetry(city, attempt + 1);
        }
    }
};
