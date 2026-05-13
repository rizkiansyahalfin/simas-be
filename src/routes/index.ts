import { Router, Request, Response } from 'express';
import authRoutes from '../modules/auth/user.route';
import jumatScheduleRouter from '../modules/jumat-schedules/jumat-schedules.route';

const router = Router();

router.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'API jalan 🚀',
  });
});

router.use('/auth', authRoutes);
router.use('/jumat-schedules', jumatScheduleRouter);

export default router;