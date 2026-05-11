import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository";
export const UserService = {
    async getAll(page = 1, limit = 10, filters = {}) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            UserRepository.findAll(skip, limit, filters),
            UserRepository.count(filters)
        ]);
        const safeUsers = users.map(({ passwordHash, ...u }) => u);
        const totalPages = Math.max(1, Math.ceil(total / limit));
        return {
            data: safeUsers,
            meta: {
                page,
                limit,
                total,
                totalPages
            }
        };
    },
    async create(data) {
        const hashed = await bcrypt.hash(data.password, 10);
        try {
            const user = await UserRepository.create({
                username: data.username,
                email: data.email,
                passwordHash: hashed,
                role: data.role
            });
            const { passwordHash, ...safeUser } = user;
            return safeUser;
        }
        catch (error) {
            if (error.code === "P2002") {
                throw new Error("EMAIL_ALREADY_USED");
            }
            throw error;
        }
    },
    async update(id, data) {
        const user = await UserRepository.findById(id);
        if (!user)
            throw new Error("USER_NOT_FOUND");
        const updated = await UserRepository.update(id, data);
        const { passwordHash, ...safeUser } = updated;
        return safeUser;
    },
    async activate(id, currentUserId) {
        if (id === currentUserId) {
            throw new Error("CANNOT_MODIFY_SELF");
        }
        return UserRepository.updateStatus(id, true);
    },
    async deactivate(id, currentUserId) {
        if (id === currentUserId) {
            throw new Error("CANNOT_MODIFY_SELF");
        }
        return UserRepository.updateStatus(id, false);
    }
};
