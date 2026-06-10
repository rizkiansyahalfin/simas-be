import jwt from "jsonwebtoken"
import { Role } from "../../generated/enums"

const ACCESS_TOKEN_EXPIRES = "8h"
const REFRESH_TOKEN_EXPIRES = "7d"

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET_MISSING")
  return secret
}

const getJwtRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error("JWT_REFRESH_SECRET_MISSING")
  return secret
}

export const TokenService = {
  createAccessToken(user: { id: number; role: Role; isActive: boolean }) {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        isActive: user.isActive
      },
      getJwtSecret(),
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    )
  },

  createRefreshToken(userId: number) {
    return jwt.sign({ id: userId }, getJwtRefreshSecret(), { expiresIn: REFRESH_TOKEN_EXPIRES })
  },

  createTempTwoFactorToken(userId: number) {
    return jwt.sign({ id: userId, purpose: "2fa" }, getJwtSecret(), { expiresIn: "10m" })
  }
}
