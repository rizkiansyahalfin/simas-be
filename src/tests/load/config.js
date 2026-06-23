export const BASE_URL =
  __ENV.BASE_URL ||
  "http://localhost:3000"

export const TOKEN =
  __ENV.TOKEN || ""

export const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json"
}