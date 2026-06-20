// health.controller.ts

import {
  Request,
  Response
} from "express"

import {
  HealthService
} from "./health.service"

export const HealthController = {

  async basic(
    req: Request,
    res: Response
  ) {

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
  },

  async detailed(
    req: Request,
    res: Response
  ) {

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
  }
}