import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
export const AuthService = {
    async login(data) {
        const { email, password } = data;
        const user = await AuthRepository.findByEmail(email);
        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }
        if (!user.isActive) {
            throw new Error("ACCOUNT_INACTIVE");
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error("INVALID_CREDENTIALS");
        }
        const token = jwt.sign({
            id: user.id,
            role: user.role,
            isActive: user.isActive
        }, process.env.JWT_SECRET, { expiresIn: "8h" });
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email
            }
        };
    }
};
