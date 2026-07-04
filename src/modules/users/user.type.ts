import { Role } from "../../generated/enums"

export type CreateUserInput = {
  username: string
  email: string
  password: string
  role: Role
}

export type UpdateUserInput = {
  username?: string
  email?: string
  role?: Role
}

export type UpdateUserProfileInput = {
  username?: string
  email?: string
  profileImage?: string
}
