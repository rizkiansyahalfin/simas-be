import prisma from "../../database"

export const AuthRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  }
}