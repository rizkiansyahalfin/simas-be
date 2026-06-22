import { TwoFactorService } from "../twofactor.service"
import { TokenService } from "../token.service"

jest.mock("../auth.repository", () => ({
  AuthRepository: {
    createRefreshToken: jest.fn(),
    findRefreshToken: jest.fn(),
    deleteRefreshToken: jest.fn(),
    findPasswordResetToken: jest.fn(),
    updatePassword: jest.fn(),
    deleteAllRefreshTokens: jest.fn(),
    createPasswordResetToken: jest.fn(),
    markPasswordResetTokenUsed: jest.fn(),
    findByEmail: jest.fn(),

    updateTwoFactorSecret: jest.fn(),
    enableTwoFactor: jest.fn(),
    disableTwoFactor: jest.fn()
  }
}))

jest.mock("../user.service", () => ({
  UserService: {
    findById: jest.fn(),
    validateCredentials: jest.fn(),
    toPublic: jest.fn()
  }
}))

jest.mock("../token.service", () => ({
  TokenService: {
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
    createTempTwoFactorToken: jest.fn()
  }
}))

jest.mock("../twofactor.service", () => ({
  TwoFactorService: {
    verifyTotp: jest.fn(),
    generateSecret: jest.fn(),
    generateQrCode: jest.fn()
  }
}))

jest.mock("../token-blacklist", () => ({
  TokenBlacklistService: {
    blacklistToken: jest.fn()
  }
}))

jest.mock("../../mail/mail.service", () => ({
  MailService: {
    sendPasswordResetEmail: jest.fn(),
    sendPasswordChangedEmail: jest.fn()
  }
}))

import { AuthService } from "../auth.service"
import { UserService } from "../user.service"

describe("AuthService", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("setupTwoFactor", () => {

    it("should setup 2fa", async () => {

      ;(UserService.findById as jest.Mock)
        .mockResolvedValue({
          id: 1
        })

      ;(TwoFactorService.generateSecret as jest.Mock)
        .mockReturnValue({
          base32: "SECRET",
          otpauth_url: "URL"
        })

      ;(TwoFactorService.generateQrCode as jest.Mock)
        .mockResolvedValue("QR")

      const result =
        await AuthService.setupTwoFactor(1)

      expect(result.secret)
        .toBe("SECRET")
    })

    it("should throw USER_NOT_FOUND", async () => {

      ;(UserService.findById as jest.Mock)
        .mockResolvedValue(null)

      await expect(
        AuthService.setupTwoFactor(1)
      ).rejects.toThrow(
        "USER_NOT_FOUND"
      )
    })
  })

  describe("verifyTwoFactor", () => {

    it("should verify otp", async () => {

      ;(UserService.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          twoFactorSecret: "SECRET"
        })

      ;(TwoFactorService.verifyTotp as jest.Mock)
        .mockReturnValue(true)

      const result =
        await AuthService.verifyTwoFactor(
          1,
          "123456"
        )

      expect(result.success)
        .toBe(true)
    })

    it("should reject invalid otp", async () => {

      ;(UserService.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          twoFactorSecret: "SECRET"
        })

      ;(TwoFactorService.verifyTotp as jest.Mock)
        .mockReturnValue(false)

      await expect(
        AuthService.verifyTwoFactor(
          1,
          "123456"
        )
      ).rejects.toThrow(
        "INVALID_OTP_CODE"
      )
    })
  })

  describe("login", () => {

    it("should login successfully", async () => {

      ;(UserService.validateCredentials as jest.Mock)
        .mockResolvedValue({
          id: 1,
          username: "master",
          role: "superadmin",
          email: "a@a.com",
          isActive: true,
          twoFactorEnabled: false
        })

      ;(TokenService.createAccessToken as jest.Mock)
        .mockReturnValue("ACCESS")

      ;(TokenService.createRefreshToken as jest.Mock)
        .mockReturnValue("REFRESH")

      ;(UserService.toPublic as jest.Mock)
        .mockReturnValue({
          id: 1
        })

      const result =
        await AuthService.login({
          email: "a",
          password: "b"
        })

      expect(result.requires2FA)
        .toBe(false)
    })

    it("should throw INVALID_CREDENTIALS", async () => {

      ;(UserService.validateCredentials as jest.Mock)
        .mockResolvedValue(null)

      await expect(
        AuthService.login({
          email: "a",
          password: "b"
        })
      ).rejects.toThrow(
        "INVALID_CREDENTIALS"
      )
    })

    it("should require 2fa", async () => {

      ;(UserService.validateCredentials as jest.Mock)
        .mockResolvedValue({
          id: 1,
          username: "master",
          role: "superadmin",
          email: "a",
          isActive: true,
          twoFactorEnabled: true
        })

      ;(TokenService.createTempTwoFactorToken as jest.Mock)
        .mockReturnValue("TEMP")

      const result =
        await AuthService.login({
          email: "a",
          password: "b"
        })

      expect(result.requires2FA)
        .toBe(true)
    })
  })
})