import { Router } from 'express';
import financeRouter from '../modules/finance/finance.route';
import authRoutes from '../modules/auth/user.route';
import jumatScheduleRouter from '../modules/jumat-schedules/jumat-schedules.route';
const router = Router();
router.get('/test', (req, res) => {
    res.json({
        message: 'API jalan 🚀',
    });
});
router.use('/finance', financeRouter);
router.use('/auth', authRoutes);
router.use('/jumat-schedules', jumatScheduleRouter);
export default router;
