import { Request, Response } from "express"

import {
  midtransConfig,
} from "../../config/midtrans.config"

export const getMidtransConfig =
  (
    req: Request,
    res: Response
  ) => {

    res.json({
      status: "success",
      data: {
        environment:
          midtransConfig.isProduction
            ? "production"
            : "sandbox",

        clientKey:
          midtransConfig.clientKey,
      },
    })
  }