import http from "k6/http"
import { check, sleep } from "k6"
import { BASE_URL, headers } from "./config.js"

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 50 },
    { duration: "2m", target: 100 },
    { duration: "30s", target: 0 }
  ],

  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"]
  }
}

export default function () {
  const res = http.get(
    `${BASE_URL}/dashboard/stats`,
    { headers }
  )

  check(res, {
    "status is 200": r => r.status === 200
  })

  sleep(1)
}