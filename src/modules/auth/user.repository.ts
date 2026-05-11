import prisma from '../../database';

export const updatePassword = async (userId: number, hashedPassword: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: hashedPassword,
    },
  });
};

export const findById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};