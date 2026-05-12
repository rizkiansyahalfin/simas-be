import { Request, Response, NextFunction } from "express"
<<<<<<< HEAD
export const rbacMiddleware = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
=======
import { Role } from "../generated/client"

export const rbacMiddleware = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      })
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        status: "error",
>>>>>>> parent of d0557e6 (Revert "Feat/be user management page and finance summary")
        message: "Forbidden"
      })
    }

    next()
  }
}