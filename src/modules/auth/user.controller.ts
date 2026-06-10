import { Request, Response } from 'express';
import * as userRepository from './user.repository';
import {AuthRepository} from "./auth.repository"
import bcrypt from 'bcrypt';
import {
  TokenBlacklistService
}
from "../auth/token-blacklist"

export const logout =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const authHeader =
        req.headers.authorization

      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {
        return res.status(401).json({
          message:
            "Unauthorized"
        })
      }

      const accessToken =
        authHeader.split(" ")[1]

      const refreshToken =
        req.cookies
          ?.refreshToken as
          string | undefined

      await TokenBlacklistService
        .blacklistToken(
          accessToken
        )

      if (refreshToken) {

        await AuthRepository
          .deleteRefreshToken(
            refreshToken
          )
      }

      res.clearCookie(
        "refreshToken"
      )

      return res.status(200).json({
        success: true,
        message:
          "Logged out successfully"
      })

    } catch {

      return res.status(500).json({
        success: false,
        error_code:
          "LOGOUT_FAILED"
      })
    }
  }

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userId = (req as Request & { user: { id: string | number } }).user.id;

  try {
    const user = await userRepository.findById(Number(userId));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(Number(userId), hashedPassword);
    await AuthRepository.deleteAllRefreshTokens(Number(userId));
    const authHeader = req.headers.authorization

    const accessToken = authHeader?.split(" ")[1]
    
    if (accessToken) {
  await TokenBlacklistService.blacklistToken(accessToken)
    }
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};