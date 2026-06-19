import { AppError } from "./app-error"
import { ErrorCodes } from "./error-codes"

export const throwAppError = (
  code: keyof typeof ErrorCodes
): never => {

  const config =
    ErrorCodes[code]

  throw new AppError(
    code,
    config.message,
    config.status
  )
}