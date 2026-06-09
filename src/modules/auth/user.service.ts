import bcrypt from "bcrypt"
import { AuthRepository } from "./auth.repository"

export const UserService = {
  async findByEmail(email: string) {
    return AuthRepository.findByEmail(email)
  },

  async findById(id: number) {
    return AuthRepository.findById(id)
  },

  async validateCredentials(email: string, password: string) {
    const user = await AuthRepository.findByEmail(email)
    if (!user) return null
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return null
    return user
  },

  toPublic(user: any) {
    return {
      id: user.id,
      username: user.username,
      name: user.username,
      role: user.role,
      email: user.email
    }
  }
}
