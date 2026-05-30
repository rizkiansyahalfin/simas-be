import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Role } from "../../generated/enums"
import { AuthRepository } from "./auth.repository"
import { LoginRequest, LoginResponse } from "./auth.type"

const ACCESS_TOKEN_EXPIRES = "8h"
const REFRESH_TOKEN_EXPIRES = "7d"
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET_MISSING")
  }
  return secret
}

const getJwtRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET_MISSING")
  }
  return secret
}

const createAccessToken = (user: { id: number; role: Role; isActive: boolean }) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      isActive: user.isActive
    },
    getJwtSecret(),
    {
      expiresIn: ACCESS_TOKEN_EXPIRES
    }
  )
}

const createRefreshToken = (userId: number) => {
  return jwt.sign(
    { id: userId },
    getJwtRefreshSecret(),
    {
      expiresIn: REFRESH_TOKEN_EXPIRES
    }
  )
}

export const AuthService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password } = data
    const user = await AuthRepository.findByEmail(email)

    if (!user) {
      throw new Error("INVALID_CREDENTIALS")
    }

    if (!user.isActive) {
      throw new Error("ACCOUNT_INACTIVE")
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      throw new Error("INVALID_CREDENTIALS")
    }

    const accessToken = createAccessToken({
      id: user.id,
      role: user.role,
      isActive: user.isActive
    })

    const refreshToken = createRefreshToken(user.id)

    await AuthRepository.createRefreshToken(
      refreshToken,
      user.id,
      new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    )

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        name: user.username,
        role: user.role,
        email: user.email
      }
    }
  },

  async refresh(refreshToken: string) {
    jwt.verify(refreshToken, getJwtRefreshSecret())

    const tokenRecord = await AuthRepository.findRefreshToken(refreshToken)

    if (!tokenRecord) {
      throw new Error("INVALID_REFRESH_TOKEN")
    }

    const accessToken = createAccessToken({
      id: tokenRecord.user.id,
      role: tokenRecord.user.role,
      isActive: tokenRecord.user.isActive
    })

    return {
      accessToken
    }
  }
}
