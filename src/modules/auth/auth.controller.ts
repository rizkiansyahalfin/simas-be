import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { LoginRequest, LoginSuccessResponse, VerifyLogin2FARequest } from "./auth.type"
import {
  loginSchema,
  verifyLoginTwoFactorSchema,
  verifyTwoFactorSchema,
  disableTwoFactorSchema
} from "./auth.validation"


export const AuthController = {
  async verifyTwoFactor(
  req: Request,
  res: Response
) {

  try {

    const userId =
      req.user?.id

    if (!userId) {
      return res.status(401).json({
        success: false,
        error_code: "UNAUTHORIZED"
      })
    }

    const { otpCode } =
      verifyTwoFactorSchema.parse(
        req.body
      )

    const result =
      await AuthService.verifyTwoFactor(
        userId,
        otpCode
      )

    return res.status(200).json({
      success: true,
      data: result
    })

  } catch (error) {

    return res.status(400).json({
      success: false,
      error_code:
        error instanceof Error
          ? error.message
          : "UNKNOWN_ERROR"
    })
  }
},

async disableTwoFactor(
  req: Request,
  res: Response
) {

  try {

    const userId =
      req.user?.id

    if (!userId) {
      return res.status(401).json({
        success: false,
        error_code: "UNAUTHORIZED"
      })
    }

    const { otpCode } =
      disableTwoFactorSchema.parse(
        req.body
      )

    const result =
      await AuthService.disableTwoFactor(
        userId,
        otpCode
      )

    return res.status(200).json({
      success: true,
      data: result
    })

  } catch (error) {

    return res.status(400).json({
      success: false,
      error_code:
        error instanceof Error
          ? error.message
          : "UNKNOWN_ERROR"
    })
  }
},

  async login(req: Request, res: Response) {
    try {
      const { email, password, otpCode }: LoginRequest = loginSchema.parse(req.body)
      const result = await AuthService.login({ email, password, otpCode })

      if (result.requires2FA) {
        return res.status(200).json({
          success: true,
          data: result
        })
      }

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user
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

  async verifyLoginTwoFactor(req: Request, res: Response) {
    try {
      const { tempToken, token }: VerifyLogin2FARequest = verifyLoginTwoFactorSchema.parse(req.body)
      const result: LoginSuccessResponse = await AuthService.verifyLoginTwoFactor(tempToken, token)

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user
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

  async setupTwoFactor(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({
          success: false,
          error_code: "UNAUTHORIZED"
        })
      }

      const result = await AuthService.setupTwoFactor(userId)

      return res.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        error_code:
          error instanceof Error
            ? error.message
            : "UNKNOWN_ERROR"
      })
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error_code: "REFRESH_TOKEN_REQUIRED"
        })
      }

      const result = await AuthService.refresh(refreshToken)

      return res.status(200).json({
        success: true,
        data: result
      })
    } catch {
      return res.status(401).json({
        success: false,
        error_code: "INVALID_REFRESH_TOKEN"
      })
    }
  }
}
