import { Role } from "../../generated/client"

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