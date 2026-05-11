import { Router } from 'express';
import * as jumatScheduleController from './jumat-schedule.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, jumatScheduleController.getAll);
router.get('/:id', authMiddleware, jumatScheduleController.getById);
router.post('/', authMiddleware, jumatScheduleController.create);
router.put('/:id', authMiddleware, jumatScheduleController.update);

export default router;