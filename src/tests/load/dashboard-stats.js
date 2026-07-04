// src/tests/load/dashboard-stats.js

import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "30s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get(
    `${__ENV.BASE_URL}/api/dashboard/stats`,
    {
      headers: {
        Authorization: `Bearer ${__ENV.TOKEN}`,
      },
    }
  );

  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}