import { AuthService } from "./auth.service";
import { loginSchema } from "./auth.validation";
export const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = loginSchema.parse(req.body) || req.body;
            const result = await AuthService.login({ email, password });
            return res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                error_code: error.message
            });
        }
    }
};
