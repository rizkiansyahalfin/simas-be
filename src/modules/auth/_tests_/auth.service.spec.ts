import { TwoFactorService } from "../twofactor.service"
import { TokenService } from "../token.service"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

process.env.FRONTEND_URL =
  "http://localhost:3000"

jest.mock("jsonwebtoken")
jest.mock("bcrypt")

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

  describe("disableTwoFactor", () => {

  it("should disable 2fa", async () => {

    ;(UserService.findById as jest.Mock)
      .mockResolvedValue({
        id: 1,
        twoFactorEnabled: true,
        twoFactorSecret: "SECRET"
      })

    ;(TwoFactorService.verifyTotp as jest.Mock)
      .mockReturnValue(true)

    const result =
      await AuthService.disableTwoFactor(
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
        twoFactorEnabled: true,
        twoFactorSecret: "SECRET"
      })

    ;(TwoFactorService.verifyTotp as jest.Mock)
      .mockReturnValue(false)

    await expect(
      AuthService.disableTwoFactor(
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

  describe("verifyLoginTwoFactor", () => {

    it("should login with valid otp", async () => {

      ;(jwt.verify as jest.Mock)
        .mockReturnValue({
          id: 1,
          purpose: "2fa"
        })

      ;(UserService.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          username: "master",
          role: "superadmin",
          email: "a@a.com",
          isActive: true,
          twoFactorEnabled: true,
          twoFactorSecret: "SECRET"
        })

      ;(TwoFactorService.verifyTotp as jest.Mock)
        .mockReturnValue(true)

      ;(TokenService.createAccessToken as jest.Mock)
        .mockReturnValue("ACCESS")

      ;(TokenService.createRefreshToken as jest.Mock)
        .mockReturnValue("REFRESH")

      ;(UserService.toPublic as jest.Mock)
        .mockReturnValue({
          id: 1
        })

      const result =
        await AuthService.verifyLoginTwoFactor(
          "TEMP",
          "123456"
        )

      expect(result.accessToken)
        .toBe("ACCESS")
    })

  })

  describe("refresh", () => {

    it("should refresh access token", async () => {

      ;(jwt.verify as jest.Mock)
        .mockReturnValue(true)

      const {
        AuthRepository
      } = await import("../auth.repository")

      ;(AuthRepository.findRefreshToken as jest.Mock)
        .mockResolvedValue({
          expiresAt:
            new Date(Date.now() + 100000),

          user: {
            id: 1,
            role: "superadmin",
            isActive: true
          }
        })

      ;(TokenService.createAccessToken as jest.Mock)
        .mockReturnValue("NEW_ACCESS")

      const result =
        await AuthService.refresh(
          "REFRESH"
        )

      expect(result.accessToken)
        .toBe("NEW_ACCESS")
    })

  })

  describe("changePassword", () => {

    it("should change password", async () => {

      ;(UserService.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          passwordHash: "OLD"
        })

      ;(bcrypt.compare as jest.Mock)
        .mockResolvedValue(true)

      ;(bcrypt.hash as jest.Mock)
        .mockResolvedValue("HASHED")

      await AuthService.changePassword(
        1,
        "old",
        "new"
      )

      const {
        AuthRepository
      } = await import("../auth.repository")

      expect(
        AuthRepository.updatePassword
      ).toHaveBeenCalled()
    })

    it("should reject invalid password", async () => {

      ;(UserService.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          passwordHash: "OLD"
        })
      
      ;(bcrypt.compare as jest.Mock)
        .mockResolvedValue(false)
      
      await expect(
        AuthService.changePassword(
          1,
          "wrong",
          "new"
        )
      ).rejects.toThrow(
        "INCORRECT_PASSWORD"
      )
    })

  })

  describe("forgotPassword", () => {

    it("should send reset email", async () => {

      const {
        AuthRepository
      } = await import("../auth.repository")

      ;(AuthRepository.findByEmail as jest.Mock)
        .mockResolvedValue({
          id: 1,
          email: "master@test.com"
        })

      ;(jwt.sign as jest.Mock)
        .mockReturnValue("RESET_TOKEN")

      await AuthService.forgotPassword(
        "master@test.com"
      )

      expect(
        AuthRepository.createPasswordResetToken
      ).toHaveBeenCalled()
    })

  })

  describe("resetPassword", () => {

    it("should reset password", async () => {
    
      ;(jwt.verify as jest.Mock)
        .mockReturnValue({
          purpose: "password-reset"
        })
      
      const {
        AuthRepository
      } = await import("../auth.repository")
    
      ;(AuthRepository.findPasswordResetToken as jest.Mock)
        .mockResolvedValue({
          id: 1,
        
          expiresAt:
            new Date(Date.now() + 10000),
        
          usedAt: null,
        
          user: {
            id: 1,
            email: "master@test.com"
          }
        })
      
      ;(bcrypt.hash as jest.Mock)
        .mockResolvedValue("HASHED")
      
      await AuthService.resetPassword(
        "TOKEN",
        "NEW_PASSWORD"
      )
    
      expect(
        AuthRepository.updatePassword
      ).toHaveBeenCalled()
    })
  
  })

  describe("logout", () => {

    it("should blacklist token", async () => {

      await AuthService.logout(
        "ACCESS",
        "REFRESH"
      )

      const {
        TokenBlacklistService
      } = await import("../token-blacklist")

      expect(
        TokenBlacklistService.blacklistToken
      ).toHaveBeenCalled()
    })

  })
})