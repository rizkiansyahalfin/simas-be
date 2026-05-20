import { Router } from 'express';
import * as userController from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/logout', authMiddleware, userController.logout);
router.put('/change-password', authMiddleware, userController.changePassword);

export default router;