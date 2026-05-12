import bcrypt from "bcrypt"
import { UserRepository } from "./user.repository"
import { CreateUserInput, UpdateUserInput } from "./user.type"

type UserFilters = {
  search?: string
  role?: string
  isActive?: boolean
}

export const UserService = {

  async getAll(page = 1, limit = 10, filters: UserFilters = {}) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      UserRepository.findAll(skip, limit, filters),
      UserRepository.count(filters)
    ])

    const safeUsers = users.map(({ passwordHash, ...u }) => u)
    const totalPages = Math.max(1, Math.ceil(total / limit))

    return {
      data: safeUsers,
      meta: {
        page,
        limit,
        total,
        totalPages
      }
    }
  },

  async create(data: CreateUserInput) {
    const hashed = await bcrypt.hash(data.password, 10)

    try {
      const user = await UserRepository.create({
        username: data.username,
        email: data.email,
        passwordHash: hashed,
        role: data.role
      })

      const { passwordHash, ...safeUser } = user
      return safeUser

    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("EMAIL_ALREADY_USED")
      }
      throw error
    }
  },

  async update(id: number, data: UpdateUserInput) {
    const user = await UserRepository.findById(id)
    if (!user) throw new Error("USER_NOT_FOUND")

    const updated = await UserRepository.update(id, data)

    const { passwordHash, ...safeUser } = updated
    return safeUser
  },

  async activate(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new Error("CANNOT_MODIFY_SELF")
    }

    return UserRepository.updateStatus(id, true)
  },

  async deactivate(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new Error("CANNOT_MODIFY_SELF")
    }

    return UserRepository.updateStatus(id, false)
  }
}