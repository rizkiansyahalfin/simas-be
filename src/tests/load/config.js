export const BASE_URL =
  __ENV.BASE_URL ||
  "http://localhost:3000"

export const TOKEN =
  __ENV.TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN1cGVyYWRtaW4iLCJpc0FjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzgyMTgzOTc5LCJleHAiOjE3ODIyMTI3Nzl9.uAA3htCob93MUR7YM1Erj0w5LCMG0yUqzX4iqEssdwM"

export const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json"
}