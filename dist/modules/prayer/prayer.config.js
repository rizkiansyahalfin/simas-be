const parseString = (value, fallback) => {
    const normalized = value?.trim();
    return normalized && normalized.length > 0 ? normalized : fallback;
};
const parseBoolean = (value) => value?.toLowerCase() === "true";
export const prayerConfig = {
    city: parseString(process.env.PRAYER_CITY, "Jakarta"),
    enabled: parseBoolean(process.env.PRAYER_SYNC_ENABLED)
};
export const updatePrayerConfig = (config) => {
    if (config.city !== undefined) {
        prayerConfig.city = parseString(config.city, prayerConfig.city);
    }
    if (typeof config.enabled === "boolean") {
        prayerConfig.enabled = config.enabled;
    }
    return prayerConfig;
};
