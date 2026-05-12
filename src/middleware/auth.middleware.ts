import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface CustomRequest extends Request {
  user?: any
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

<<<<<<< HEAD
=======
    if (typeof decoded === 'object' && decoded !== null && 'isActive' in decoded && (decoded as any).isActive === false) {
      return res.status(403).json({ message: 'Account inactive' })
    }

>>>>>>> parent of d0557e6 (Revert "Feat/be user management page and finance summary")
    req.user = decoded as any

    next()
  } catch {
    return res.status(401).json({ message: "Token invalid" })
  }
}