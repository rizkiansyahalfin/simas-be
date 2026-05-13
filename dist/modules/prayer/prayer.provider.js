import axios from "axios";
export const PrayerProvider = {
    async fetch(city) {
        try {
            const res = await axios.get("API_URL", {
                params: { city },
                timeout: 5000
            });
            if (!res.data) {
                throw new Error("INVALID_RESPONSE");
            }
            return res.data;
        }
        catch (err) {
            const axiosErr = err;
            // eslint-disable-next-line preserve-caught-error
            throw new Error(axiosErr.message || `Failed to fetch prayer data for ${city}`);
        }
    }
};
