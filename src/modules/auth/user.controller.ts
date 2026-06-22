import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { AppError } from '../../errors/app-error'
import { AuthService } from './auth.service'
import { AuthUtils } from './auth.utils'

export const logout =
  asyncHandler(async (
    req: Request,
    res: Response
  ) => {

      const accessToken = AuthUtils.getAccessTokenFromRequest(req)
      const refreshToken = AuthUtils.getRefreshTokenFromRequest(req)

      if (!accessToken) {
        throw new AppError(
          "UNAUTHORIZED",
          "Unauthorized",
          401
        )
      }

      await AuthService.logout(accessToken, refreshToken)
      AuthUtils.clearRefreshTokenCookie(res)

      return res.status(200).json({
        success: true,
        message:
          "Logged out successfully"
      })
  })

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body
  const userId = req.user?.id

  if (!userId) {
    throw new AppError(
      "UNAUTHORIZED",
      "Unauthorized",
      401
    )
  }

    const accessToken = AuthUtils.getAccessTokenFromRequest(req)

    await AuthService.changePassword(
      userId,
      oldPassword,
      newPassword,
      accessToken ?? undefined
    )

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    })
})