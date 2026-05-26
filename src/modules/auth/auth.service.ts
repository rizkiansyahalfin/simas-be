import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthRepository } from "./auth.repository"
import { LoginRequest,LoginResponse } from "./auth.type"

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

const accessToken =
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      isActive: user.isActive
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "8h"
    }
  )

  const refreshToken =
  jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d"
    }
  )

  await AuthRepository.createRefreshToken(
  refreshToken,
  user.id,
  new Date(
    Date.now() +
    7 * 24 * 60 * 60 * 1000
  )
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

  async refresh(
  refreshToken: string
) {

  const secret =
    process.env.JWT_REFRESH_SECRET

  if (!secret) {
    throw new Error(
      "REFRESH_SECRET_MISSING"
    )
  }

  const decoded =
    jwt.verify(
      refreshToken,
      secret
    ) as {
      id: number
    }

  const tokenRecord =
    await AuthRepository
      .findRefreshToken(
        refreshToken
      )

  if (!tokenRecord) {
    throw new Error(
      "INVALID_REFRESH_TOKEN"
    )
  }

  const accessToken =
    jwt.sign(
      {
        id:
          tokenRecord.user.id,

        role:
          tokenRecord.user.role,

        isActive:
          tokenRecord.user.isActive
      },

      process.env.JWT_SECRET!,
      {
        expiresIn: "8h"
      }
    )

  return {
    accessToken
  }
}
}