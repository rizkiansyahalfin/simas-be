import type { RequestHandler } from "express"
import { sanitizeInput } from "../utils/sanitize"

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return sanitizeInput(value)
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizeValue(nestedValue),
      ])
    )
  }

  return value
}

export const inputSanitizationMiddleware: RequestHandler = (req, _res, next) => {
  req.body = sanitizeValue(req.body) as typeof req.body
  // req.query = sanitizeValue(req.query) as typeof req.query
  req.params = sanitizeValue(req.params) as typeof req.params

  next()
}
