import { AuthUser } from "../modules/auth/auth.type"

declare global {
  namespace Express {
     interface User {
      id: number
      role: Role
      isActive?: boolean
    }
    
    interface Request {
      user?: AuthUser
    }
  }
}