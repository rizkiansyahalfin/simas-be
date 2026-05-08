import prisma from '../../database';
import bcrypt from 'bcrypt';
export const updatePassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedPassword },
    });
};
export const findUserById = async (id) => {
    return await prisma.user.findUnique({ where: { id } });
};
