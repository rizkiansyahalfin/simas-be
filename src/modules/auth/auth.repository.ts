import prisma from "../../database"

export const AuthRepository = {

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id }
    })
  },

  async updateTwoFactorSecret(
    userId: number,
    secret: string
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret
      }
    })
  },

  async enableTwoFactor(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true
      }
    })
  },

  async disableTwoFactor(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
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

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: true
      }
    })
  },

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.deleteMany({
      where: { token }
    })
  }
}