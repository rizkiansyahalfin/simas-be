import prisma from '../../database';
import bcrypt from 'bcrypt';

export const updatePassword = async (userId: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword },
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};