import http from "k6/http"
import { check } from "k6"
import {
  BASE_URL,
  headers
}
from "./config.js"

export const options = {

  vus: 100,

  duration: "5m",

  thresholds: {

    http_req_duration: [
      "p(95)<3000"
    ],

    http_req_failed: [
      "rate<0.01"
    ]
  }
}

export default function () {

  const res =
    http.get(
      `${BASE_URL}/reports/annual?year=2025`,
      { headers }
    )

  check(res, {
    "annual report ok":
      r => r.status === 200
  })
}