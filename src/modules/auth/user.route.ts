import { Router } from 'express';
import * as userController from './user.controller';
import { asyncHandler } from '../../utils/async-handler'
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/logout', authMiddleware, asyncHandler(userController.logout));
router.put('/change-password', authMiddleware, asyncHandler(userController.changePassword));

export default router;