import { Request, Response } from "express"

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken"
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

export const AuthUtils = {
  setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MAX_AGE
    })
  },

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
  },

  getRefreshTokenFromRequest(req: Request): string | undefined {
    return req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined
  },

  getAccessTokenFromRequest(req: Request): string | null {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }
    return authHeader.split(" ")[1]
  }
}
