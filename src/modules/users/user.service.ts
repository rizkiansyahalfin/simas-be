import bcrypt from "bcrypt"
import { Role } from "../../generated/enums"
import { UserRepository } from "./user.repository"
import { CreateUserInput, UpdateUserInput } from "./user.type"

type UserFilters = {
  search?: string
  role?: Role
  isActive?: boolean
}

export const UserService = {

  async getAll(page = 1, limit = 10, filters: UserFilters = {}) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      UserRepository.findAll(skip, limit, filters),
      UserRepository.count(filters)
    ])

    const safeUsers = users.map(({ passwordHash: _, ...u }) => u)
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

      const { passwordHash: _, ...safeUser } = user
      console.log(_)
      return safeUser

    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && 'code' in error && (error as { code: string }).code === "P2002") {
        throw new Error("EMAIL_ALREADY_USED", { cause: error })
      }
      throw error
    }
  },

  async update(id: number, data: UpdateUserInput) {
    const user = await UserRepository.findById(id)
    if (!user) throw new Error("USER_NOT_FOUND")

    const updated = await UserRepository.update(id, data)

    const { passwordHash: _, ...safeUser } = updated
    console.log(_)
    return safeUser
  },

  async getProfile(userId: number) {
  const user =
    await UserRepository.findById(userId)

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  const {
    passwordHash: _,
    ...safeUser
  } = user;

  console.log(_);

  return safeUser
},

async updateProfile(
  userId: number,
  data: {
    username?: string
    email?: string
    profileImage?: string
  }
) {

  const user =
    await UserRepository.findById(userId)

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  const updated =
    await UserRepository.update(
      userId,
      data
    )

  const {
    passwordHash: _,
    ...safeUser
  } = updated;

  console.log(_);

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