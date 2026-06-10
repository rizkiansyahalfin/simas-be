import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthUtils } from './auth.utils'

export const logout =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const accessToken = AuthUtils.getAccessTokenFromRequest(req)
      const refreshToken = AuthUtils.getRefreshTokenFromRequest(req)

      if (!accessToken) {
        return res.status(401).json({
          success: false,
          error_code: "UNAUTHORIZED"
        })
      }

      await AuthService.logout(accessToken, refreshToken)
      AuthUtils.clearRefreshTokenCookie(res)

      return res.status(200).json({
        success: true,
        message:
          "Logged out successfully"
      })

    } catch {

      return res.status(500).json({
        success: false,
        error_code:
          "LOGOUT_FAILED"
      })
    }
  }

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body
  const userId = req.user?.id

  if (!userId) {
    return res.status(401).json({
      success: false,
      error_code: "UNAUTHORIZED"
    })
  }

  try {
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
  } catch (error: unknown) {
    const errorCode = error instanceof Error ? error.message : "INTERNAL_ERROR"
    const status = errorCode === "INCORRECT_PASSWORD" ? 400 : 500

    return res.status(status).json({
      success: false,
      error_code: errorCode
    })
  }
}
