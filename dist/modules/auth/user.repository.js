import prisma from '../../database';
export const updatePassword = async (userId, hashedPassword) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            passwordHash: hashedPassword,
        },
    });
};
export const findById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};
