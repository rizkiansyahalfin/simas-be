import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { LoginRequest }from "./auth.type"

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body

      const result = await AuthService.login({ email, password })

      return res.status(200).json({
        success: true,
        data: result
      })
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message
      })
    }
  }
}