import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthRepository } from "./auth.repository"
import { LoginRequest,LoginResponse } from "./auth.type"

export const AuthService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password } = data
    const user = await AuthRepository.findByEmail(email)

    if (!user) {
      throw new Error("Email atau password salah")
    }

    if (!user.isActive) {
      throw new Error("Akun tidak aktif")
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      throw new Error("Email atau password salah")
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    )

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }
  }
}