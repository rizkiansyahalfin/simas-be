import { Request, Response, NextFunction } from "express"
import { Prisma }from "../generated/client"
import { ZodError } from "zod"
import { AppError } from "../errors/app-error"
import { logger } from "../config/logger"

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {

  console.error("FULL ERROR:")
  console.error(error)

  logger.error(
    error.message,
    {
      path:
        req.originalUrl,

      method:
        req.method,

      stack:
        error.stack
    }
  )

  if (
    error instanceof ZodError
  ) {

    return res.status(400)
      .json({

        success: false,

        code:
          "VALIDATION_ERROR",

        message:
          "Validation failed",

        errors:
          error.flatten()
      })
  }

  if (
    error instanceof AppError
  ) {

    return res.status(
      error.statusCode
    ).json({

      success: false,

      code:
        error.code,

      message:
        error.message,

      details:
        error.details
    })
  }

  if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
    
      switch (error.code) {
    
        case "P2002":
    
          return res.status(409)
            .json({
            
              success: false,
            
              code:
                "DUPLICATE_RECORD",
            
              message:
                "Data already exists"
            })
        
        case "P2025":
        
          return res.status(404)
            .json({
            
              success: false,
            
              code:
                "RECORD_NOT_FOUND",
            
              message:
                "Record not found"
            })
      }
    }

  return res.status(500)
    .json({

      success: false,

      code:
        "INTERNAL_SERVER_ERROR",

      message:
        "Internal server error"
    })
}