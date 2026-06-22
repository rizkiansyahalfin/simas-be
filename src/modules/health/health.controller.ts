import {
  Request,
  Response
} from "express"

import { asyncHandler } from "../../utils/async-handler"

import {
  HealthService
} from "./health.service"

export const HealthController = {

  basic: asyncHandler(async (
    req: Request,
    res: Response
  ) => {

    const result =
      await HealthService
        .getBasicHealth()

    const statusCode =
      result.status === "healthy"
        ? 200
        : 503

    res
      .status(statusCode)
      .json(result)
  }),

  detailed: asyncHandler(async (
    req: Request,
    res: Response
  ) => {

    const result =
      await HealthService
        .getDetailedHealth()

    const statusCode =
      result.status === "healthy"
        ? 200
        : 503

    res
      .status(statusCode)
      .json(result)
  })
}