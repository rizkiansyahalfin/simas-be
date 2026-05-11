import * as userRepository from './user.repository';
import bcrypt from 'bcrypt';
export const logout = async (req, res) => {
    res.status(200).json({
        message: 'Logged out successfully'
    });
};
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
        const user = await userRepository.findById(Number(userId));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }
        await userRepository.updatePassword(Number(userId), newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
