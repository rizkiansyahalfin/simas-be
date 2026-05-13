import { Request, Response, NextFunction } from "express"
import { Role } from "../prisma/generated/prisma"

export const rbacMiddleware = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user || !user.role) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      })
    }

    if (!allowedRoles.includes(user.role as Role)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden"
      })
    }

    next()
  }
}