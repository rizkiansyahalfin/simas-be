import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Role } from "../../generated/enums"
import { AuthRepository } from "./auth.repository"
import { LoginRequest, LoginResponse, LoginSuccessResponse, Temp2FAPayload } from "./auth.type"
import speakeasy from "speakeasy"
import QRCode from "qrcode"


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

const createTempTwoFactorToken = (userId: number) => {
  return jwt.sign(
    { id: userId, purpose: "2fa" },
    getJwtSecret(),
    {
      expiresIn: "10m"
    }
  )
}

const generateOtpSecret = () => {
  return speakeasy.generateSecret({
    name: process.env.TWO_FACTOR_APP_NAME || "SIMAS"
  })
}

export const AuthService = {
  async setupTwoFactor(userId: number) {

  const user =
    await AuthRepository.findById(userId)

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  const secret =
    generateOtpSecret()

  await AuthRepository.updateTwoFactorSecret(
    user.id,
    secret.base32
  )

  const qrCode =
    await QRCode.toDataURL(
      secret.otpauth_url ?? ""
    )

  return {
    secret: secret.base32,
    qrCode
  }
},

async verifyTwoFactor(
  userId: number,
  otpCode: string
) {

  const user =
    await AuthRepository.findById(userId)

  if (
    !user ||
    !user.twoFactorSecret
  ) {
    throw new Error(
      "TWO_FACTOR_NOT_SETUP"
    )
  }

  const verified =
    speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otpCode,
      window: 1
    })

  if (!verified) {
    throw new Error(
      "INVALID_OTP_CODE"
    )
  }

  await AuthRepository.enableTwoFactor(
    user.id
  )

  return {
    success: true
  }
},


async disableTwoFactor(
  userId: number,
  otpCode: string
) {

  const user =
    await AuthRepository.findById(userId)

  if (
    !user ||
    !user.twoFactorEnabled ||
    !user.twoFactorSecret
  ) {
    throw new Error(
      "TWO_FACTOR_NOT_ENABLED"
    )
  }

  const verified =
    speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otpCode,
      window: 1
    })

  if (!verified) {
    throw new Error(
      "INVALID_OTP_CODE"
    )
  }

  await AuthRepository.disableTwoFactor(
    user.id
  )

  return {
    success: true
  }
},
  
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password, otpCode } = data
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

    if (user.twoFactorEnabled) {
      if (!otpCode) {
        return {
          requires2FA: true,
          tempToken: createTempTwoFactorToken(user.id),
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email
          }
        }
      }

      const validOtp = speakeasy.totp.verify({
        secret: user.twoFactorSecret ?? "",
        encoding: "base32",
        token: otpCode,
        window: 1
      })

      if (!validOtp) {
        throw new Error("INVALID_OTP_CODE")
      }
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
      requires2FA: false,
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

  async verifyLoginTwoFactor(
    tempToken: string,
    token: string
  ): Promise<LoginSuccessResponse> {
    let payload: Temp2FAPayload

    try {
      payload = jwt.verify(tempToken, getJwtSecret()) as Temp2FAPayload
    } catch {
      throw new Error("INVALID_TEMP_TOKEN")
    }

    if (payload.purpose !== "2fa" || !payload.id) {
      throw new Error("INVALID_TEMP_TOKEN")
    }

    const user = await AuthRepository.findById(payload.id)

    if (!user) {
      throw new Error("USER_NOT_FOUND")
    }

    if (!user.isActive) {
      throw new Error("ACCOUNT_INACTIVE")
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new Error("TWO_FACTOR_NOT_SETUP")
    }

    const validOtp = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1
    })

    if (!validOtp) {
      throw new Error("INVALID_OTP_CODE")
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
      requires2FA: false,
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
