import bcrypt from "bcrypt"
import { Role } from "../../generated/enums"
import { UserRepository } from "./user.repository"
import { CreateUserInput, UpdateUserInput, UpdateUserProfileInput } from "./user.type"

type UserFilters = {
  search?: string
  role?: Role
  isActive?: boolean
}

const excludePasswordHash = <T extends { passwordHash: string }>(user: T) => {
  const { passwordHash, ...safeUser } = user;
  console.log("Excluding passwordHash from user:", pas)
  return safeUser
}

const getUserOrThrow = async (userId: number) => {
  const user = await UserRepository.findById(userId)
  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }
  return user
}

export const UserService = {
  async getAll(page = 1, limit = 10, filters: UserFilters = {}) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      UserRepository.findAll(skip, limit, filters),
      UserRepository.count(filters)
    ])

    const safeUsers = users.map(excludePasswordHash)
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

      return excludePasswordHash(user)
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
        throw new Error("EMAIL_ALREADY_USED", { cause: error })
      }
      throw error
    }
  },

  async update(id: number, data: UpdateUserInput) {
    await getUserOrThrow(id)

    const updated = await UserRepository.update(id, data)
    return excludePasswordHash(updated)
  },

  async getProfile(userId: number) {
    const user = await getUserOrThrow(userId)
    return excludePasswordHash(user)
  },

  async updateProfile(userId: number, data: UpdateUserProfileInput) {
    await getUserOrThrow(userId)

    const updated = await UserRepository.update(userId, data)
    return excludePasswordHash(updated)
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
