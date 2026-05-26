import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { LoginRequest }from "./auth.type"
import { loginSchema } from "./auth.validation"

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = loginSchema.parse(req.body) || req.body

      const result = await AuthService.login({ email, password })

      res.cookie(
        "refreshToken",
        result.refreshToken,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
        
          sameSite: "strict",
        
          maxAge:
            7 *
            24 *
            60 *
            60 *
            1000
        }
      )

            return res.status(200).json({
        success: true,
            
        data: {
          accessToken:
            result.accessToken,
        
          user:
            result.user
        }
      })
    } catch (error: unknown) {
      const errorCode = error instanceof Error ? error.message : String(error)
      return res.status(401).json({
        success: false,
        error_code: errorCode
      })
    }
  },

  async refresh(
  req: Request,
  res: Response
) {

  try {

    const refreshToken =
      req.cookies.refreshToken

    if (!refreshToken) {

      return res.status(401).json({
        success: false,
        error_code:
          "REFRESH_TOKEN_REQUIRED"
      })
    }

    const result =
      await AuthService.refresh(
        refreshToken
      )

    return res.status(200).json({
      success: true,
      data: result
    })

  } catch {

    return res.status(401).json({
      success: false,
      error_code:
        "INVALID_REFRESH_TOKEN"
    })
  }
}

}