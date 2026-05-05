import { Router, Request, Response } from 'express';
import financeRouter from '../modules/finance/finance.route';

const router = Router();

router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'API jalan 🚀' });
});

// Register Module Finance
router.use('/finance', financeRouter)

export default router;