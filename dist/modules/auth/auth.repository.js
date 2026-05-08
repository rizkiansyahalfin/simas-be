import prisma from "../../database";
export const AuthRepository = {
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }
};
