import { Role } from "../../generated/enums"

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
    role: Role,
    email: string
  }
}

// ======================
// JWT PAYLOAD
// ======================

export type JwtPayload = {
  id: number
  role: Role
  isActive?: boolean
}

// ======================
 // AUTH USER (ATTACHED TO REQUEST)
 // ======================

export type AuthUser = {
  id: number
  role: Role
  isActive?: boolean
}