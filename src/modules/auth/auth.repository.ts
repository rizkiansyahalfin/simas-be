import prisma from "../../database"

export const AuthRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async createRefreshToken(
  token: string,
  userId: number,
  expiresAt: Date
) {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  })
},

async findRefreshToken(
  token: string
) {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: {
      user: true
    }
  })
},

async deleteRefreshToken(
  token: string
) {
  return prisma.refreshToken.deleteMany({
    where: { token }
  })
}
}