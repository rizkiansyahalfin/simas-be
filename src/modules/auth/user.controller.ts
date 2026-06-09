import { Request, Response } from 'express';
import * as userRepository from './user.repository';
import bcrypt from 'bcrypt';

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Logged out successfully' 
  });
};

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
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};