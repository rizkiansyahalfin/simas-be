import jwt from "jsonwebtoken"
import { AuthRepository } from "./auth.repository"
import { LoginRequest, LoginResponse, LoginSuccessResponse, Temp2FAPayload, PasswordResetPayload } from "./auth.type"
import { TokenService } from "./token.service"
import { TwoFactorService } from "./twofactor.service"
import { UserService } from "./user.service"
import { MailService } from "../mail/mail.service"
import crypto from "crypto"


const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000
const PASSWORD_RESET_EXPIRES = "1h"


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

const createPasswordResetToken = (
  userId: number
) => {
  return jwt.sign(
    {
      id: userId,
      purpose: "password-reset"
    },
    getJwtSecret(),
    {
      expiresIn: PASSWORD_RESET_EXPIRES
    }
  )
}

export const AuthService = {
  async setupTwoFactor(userId: number) {
    const user = await UserService.findById(userId)
    if (!user) throw new Error("USER_NOT_FOUND")

    const secret = TwoFactorService.generateSecret()
    await AuthRepository.updateTwoFactorSecret(user.id, secret.base32)
    const qrCode = await TwoFactorService.generateQrCode(secret.otpauth_url ?? "")

    return { secret: secret.base32, qrCode }
  },

  async verifyTwoFactor(userId: number, otpCode: string) {
    const user = await UserService.findById(userId)
    if (!user || !user.twoFactorSecret) throw new Error("TWO_FACTOR_NOT_SETUP")

    const verified = TwoFactorService.verifyTotp(user.twoFactorSecret, otpCode)
    if (!verified) throw new Error("INVALID_OTP_CODE")

    await AuthRepository.enableTwoFactor(user.id)
    return { success: true }
  },

  async disableTwoFactor(userId: number, otpCode: string) {
    const user = await UserService.findById(userId)
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) throw new Error("TWO_FACTOR_NOT_ENABLED")

    const verified = TwoFactorService.verifyTotp(user.twoFactorSecret, otpCode)
    if (!verified) throw new Error("INVALID_OTP_CODE")

    await AuthRepository.disableTwoFactor(user.id)
    return { success: true }
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password, otpCode } = data
    const user = await UserService.validateCredentials(email, password)
    if (!user) throw new Error("INVALID_CREDENTIALS")
    if (!user.isActive) throw new Error("ACCOUNT_INACTIVE")

    if (user.twoFactorEnabled) {
      if (!otpCode) {
        return {
          requires2FA: true,
          tempToken: TokenService.createTempTwoFactorToken(user.id),
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email
          }
        }
      }

      const validOtp = TwoFactorService.verifyTotp(user.twoFactorSecret ?? "", otpCode)
      if (!validOtp) throw new Error("INVALID_OTP_CODE")
    }

    const accessToken = TokenService.createAccessToken({ id: user.id, role: user.role, isActive: user.isActive })
    const refreshToken = TokenService.createRefreshToken(user.id)

    await AuthRepository.createRefreshToken(refreshToken, user.id, new Date(Date.now() + REFRESH_TOKEN_TTL_MS))

    return { requires2FA: false, accessToken, refreshToken, user: UserService.toPublic(user) }
  },

  async verifyLoginTwoFactor(tempToken: string, token: string): Promise<LoginSuccessResponse> {
    let payload: Temp2FAPayload
    try {
      payload = jwt.verify(tempToken, getJwtSecret()) as Temp2FAPayload
    } catch {
      throw new Error("INVALID_TEMP_TOKEN")
    }

    if (payload.purpose !== "2fa" || !payload.id) throw new Error("INVALID_TEMP_TOKEN")

    const user = await UserService.findById(payload.id)
    if (!user) throw new Error("USER_NOT_FOUND")
    if (!user.isActive) throw new Error("ACCOUNT_INACTIVE")
    if (!user.twoFactorEnabled || !user.twoFactorSecret) throw new Error("TWO_FACTOR_NOT_SETUP")

    const validOtp = TwoFactorService.verifyTotp(user.twoFactorSecret, token)
    if (!validOtp) throw new Error("INVALID_OTP_CODE")

    const accessToken = TokenService.createAccessToken({ id: user.id, role: user.role, isActive: user.isActive })
    const refreshToken = TokenService.createRefreshToken(user.id)

    await AuthRepository.createRefreshToken(refreshToken, user.id, new Date(Date.now() + REFRESH_TOKEN_TTL_MS))

    return { requires2FA: false, accessToken, refreshToken, user: UserService.toPublic(user) }
  },

  async refresh(refreshToken: string) {
    jwt.verify(refreshToken, getJwtRefreshSecret())

    const tokenRecord = await AuthRepository.findRefreshToken(refreshToken)
    if (!tokenRecord) throw new Error("INVALID_REFRESH_TOKEN")
    if (tokenRecord.expiresAt < new Date()) {  throw new Error("INVALID_REFRESH_TOKEN")}

    const accessToken = TokenService.createAccessToken({ id: tokenRecord.user.id, role: tokenRecord.user.role, isActive: tokenRecord.user.isActive })
    return { accessToken }
  },

  async forgotPassword(email: string) {
    const user = await AuthRepository.findByEmail(email)
    if (!user) return

    const resetToken = createPasswordResetToken(user.id)
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

    await AuthRepository.createPasswordResetToken(tokenHash, user.id, new Date(Date.now() + 60 * 60 * 1000))
    const frontendUrl = process.env.FRONTEND_URL
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`
    await MailService.sendPasswordResetEmail(user.email, resetLink)
  },

  async resetPassword(token: string, password: string) {
    let payload: PasswordResetPayload
    try {
      payload = jwt.verify(token, getJwtSecret()) as PasswordResetPayload
    } catch {
      throw new Error("INVALID_RESET_TOKEN")
    }

    if (payload.purpose !== "password-reset") throw new Error("INVALID_RESET_TOKEN")

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    const tokenRecord = await AuthRepository.findPasswordResetToken(tokenHash)
    if (!tokenRecord) throw new Error("INVALID_RESET_TOKEN")

    if (tokenRecord.usedAt) throw new Error("TOKEN_ALREADY_USED")
    if (tokenRecord.expiresAt < new Date()) throw new Error("RESET_TOKEN_EXPIRED")

    const hashedPassword = await (await import('bcrypt')).hash(password, 10)

    await AuthRepository.updatePassword(tokenRecord.user.id, hashedPassword)
    await AuthRepository.markPasswordResetTokenUsed(tokenRecord.id)
    await AuthRepository.deleteAllRefreshTokens(tokenRecord.user.id)
    await MailService.sendPasswordChangedEmail(tokenRecord.user.email)
  }
}
