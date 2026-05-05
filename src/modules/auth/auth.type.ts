import { Role } from "../../generated/client"

// ======================
// REQUEST TYPES
// ======================

export type LoginRequest = {
  email: string
  password: string
}

// ======================
// RESPONSE TYPES
// ======================

export type LoginResponse = {
  token: string
  user: {
    id: number
    username: string
    role: Role
  }
}

// ======================
// JWT PAYLOAD
// ======================

export type JwtPayload = {
  id: number
  role: Role
}

// ======================
// AUTH USER (ATTACHED TO REQUEST)
// ======================

export type AuthUser = {
  id: number
  role: Role
}