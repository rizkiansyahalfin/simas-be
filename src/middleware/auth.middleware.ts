import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '../modules/auth/auth.type'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      return res.status(500).json({ message: 'JWT secret is not configured' })
    }

    const decoded = jwt.verify(token, secret) as JwtPayload | string

    if (typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid token' })
    }

    if (decoded.isActive === false) {
      return res.status(403).json({ message: 'Account inactive' })
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      isActive: decoded.isActive,
    }

    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

