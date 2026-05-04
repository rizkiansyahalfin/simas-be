import { Request, Response, NextFunction } from "express"
export const rbacMiddleware = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden"
      })
    }

    next()
  }
}