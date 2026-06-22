import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { AppError } from "../../errors/app-error"
import { AuthService } from "./auth.service"
import { AuthUtils } from "./auth.utils"
import { LoginRequest, LoginSuccessResponse, VerifyLogin2FARequest } from "./auth.type"
import {
  loginSchema,
  verifyLoginTwoFactorSchema,
  verifyTwoFactorSchema,
  disableTwoFactorSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "./auth.validation"


export const AuthController = {
  verifyTwoFactor: asyncHandler(async (
  req: Request,
  res: Response
) => {

    const userId =
      req.user?.id

    if (!userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "Unauthorized",
        401
      )
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
}),

disableTwoFactor: asyncHandler(async (
  req: Request,
  res: Response
) => {

    const userId =
      req.user?.id

    if (!userId) {
      throw new AppError(
        "UNAUTHORIZED",
        "Unauthorized",
        401
      )
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
}),

  login: asyncHandler(async (req: Request, res: Response) => {
      const { email, password, otpCode }: LoginRequest = loginSchema.parse(req.body)
      const result = await AuthService.login({ email, password, otpCode })

      if (result.requires2FA) {
        return res.status(200).json({
          success: true,
          data: result
        })
      }

      AuthUtils.setRefreshTokenCookie(res, result.refreshToken)

      return res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user
        }
      })
  }),

  verifyLoginTwoFactor: asyncHandler(async (req: Request, res: Response) => {
      const { tempToken, token }: VerifyLogin2FARequest = verifyLoginTwoFactorSchema.parse(req.body)
      const result: LoginSuccessResponse = await AuthService.verifyLoginTwoFactor(tempToken, token)

      AuthUtils.setRefreshTokenCookie(res, result.refreshToken)

      return res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user
        }
      })
  }),

  setupTwoFactor: asyncHandler(async (req: Request, res: Response) => {
      const userId = req.user?.id

      if (!userId) {
        throw new AppError(
          "UNAUTHORIZED",
          "Unauthorized",
          401
        )
      }

      const result = await AuthService.setupTwoFactor(userId)

      return res.status(200).json({
        success: true,
        data: result
      })
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
      const refreshToken = AuthUtils.getRefreshTokenFromRequest(req)

      if (!refreshToken) {
        throw new AppError(
          "REFRESH_TOKEN_REQUIRED",
          "Refresh token is required",
          401
        )
      }

      const result = await AuthService.refresh(refreshToken)

      return res.status(200).json({
        success: true,
        data: result
      })
  }),

  forgotPassword: asyncHandler(async (
  req: Request,
  res: Response
) => {

    const { email } =
      forgotPasswordSchema.parse(
        req.body
      )

    await AuthService
      .forgotPassword(
        email
      )

    return res.status(200).json({
      success: true,
      message:
        "Jika email terdaftar, link reset password telah dikirim"
    })
}),

resetPassword: asyncHandler(async (
  req: Request,
  res: Response
) => {

    const {
      token,
      password
    } =
      resetPasswordSchema.parse(
        req.body
      )

    await AuthService
      .resetPassword(
        token,
        password
      )

    return res.status(200).json({
      success: true,
      message:
        "Password berhasil diubah"
    })
})
}