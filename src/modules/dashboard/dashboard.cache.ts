// dashboard.cache.ts

// dashboard.cache.ts

import redis from "../../lib/redis";

export const clearDashboardCache =
  async () => {

    await redis.del(
      DASHBOARD_STATS_CACHE_KEY
    );
  };

export const DASHBOARD_STATS_CACHE_KEY =
  "dashboard:stats";

export const DASHBOARD_STATS_TTL =
  60; // 1 menit