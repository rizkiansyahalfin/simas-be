import { Router } from 'express';
import * as controller from './finance.controller';

const router = Router();

router.get('/cash', controller.getCash);
router.post('/cash', controller.postCash);
router.delete('/cash/:id', controller.deleteCash);

export default router;