export const rbacMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.role) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                status: "error",
                message: "Forbidden"
            });
        }
        next();
    };
};
