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

  const success = check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 1s": (r) => r.timings.duration < 1000,
  });

  if (!success) {
    console.log(
      JSON.stringify({
        status: res.status,
        body: res.body?.slice(0, 300),
      })
    );
  }
}