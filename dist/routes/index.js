import { Router } from 'express';
import financeRouter from '../modules/finance/finance.route';
import authRoutes from '../modules/auth/user.route';
const router = Router();
router.get('/test', (req, res) => {
    res.json({ message: 'API jalan 🚀' });
});
router.use('/finance', financeRouter);
router.use('/auth', authRoutes);
export default router;
