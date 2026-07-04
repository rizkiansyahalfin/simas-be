import http from "k6/http"
import { check } from "k6"
import { BASE_URL } from "./config.js"

export const options = {
  vus: 100,
  duration: "3m",

  thresholds: {
    http_req_duration: ["p(95)<2000"],
    http_req_failed: ["rate<0.01"]
  }
}

export default function () {

  const payload = JSON.stringify({
    donorName: "Load Test User",
    donorEmail: "loadtest@example.com",
    phone: "08123456789",
    amount: 100000,
    categoryId: 1
  })

  const res = http.post(
    `${BASE_URL}/api/payments/create-transaction`,
    payload,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )

  check(res, {
    "transaction created": (r) => r.status === 201
  })
}