import { Role } from "../../generated/enums"

// ======================
// REQUEST
// ======================

export type LoginRequest = {
  email: string
  password: string
  otpCode?: string
}

export type VerifyLogin2FARequest = {
  tempToken: string
  token: string
}

export type Verify2FARequest = {
  token: string
}

export type Disable2FARequest = {
  token: string
}

// ======================
// USER
// ======================

export type AuthUser = {
  id: number
  role: Role
  isActive?: boolean
}

// ======================
// JWT
// ======================

export type JwtPayload = {
  id: number
  role: Role
  isActive?: boolean
}

export type Temp2FAPayload = {
  id: number
  purpose: "2fa"
}

// ======================
// LOGIN RESPONSE
// ======================

export type LoginSuccessResponse = {
  requires2FA: false
  accessToken: string
  refreshToken: string
  user: {
    id: number
    username: string
    name: string
    role: Role
    email: string
  }
}

export type LoginRequires2FAResponse = {
  requires2FA: true
  tempToken: string
  user: {
    id: number
    username: string
    role: Role
    email: string
  }
}

export type LoginResponse = LoginSuccessResponse | LoginRequires2FAResponse

// ======================
// SETUP RESPONSE
// ======================

export type Setup2FAResponse = {
  secret: string
  otpauthUrl: string
  qrCodeDataUrl: string
}

// ======================
// 2FA
// ======================

export type SetupTwoFactorResponse = {
  secret: string
  qrCode: string
}

export type VerifyTwoFactorInput = {
  otpCode: string
}

export type DisableTwoFactorInput = {
  otpCode: string
}

