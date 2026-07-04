import bcrypt from "bcrypt"
import { AuthRepository } from "./auth.repository"
import { User } from "../../generated/client"
import {
  TokenBlacklistService
}
from "../auth/token-blacklist"

export const UserService = {
  async findByEmail(email: string) {
    return AuthRepository.findByEmail(email)
  },

  async findById(id: number) {
    return AuthRepository.findById(id)
  },

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await AuthRepository.findByEmail(email)
    if (!user) return null
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return null
    return user
  },

  async logout(
  accessToken: string,
  refreshToken?: string
) {

  await TokenBlacklistService
    .blacklistToken(
      accessToken
    )

  if (refreshToken) {
    await AuthRepository
      .deleteRefreshToken(
        refreshToken
      )
  }
},

  toPublic(user: User) {
    return {
      id: user.id,
      username: user.username,
      name: user.username,
      role: user.role,
      email: user.email
    }
  }
}
