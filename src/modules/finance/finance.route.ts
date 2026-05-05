import { Router } from 'express';
import * as controller from './finance.controller';

const router = Router();

router.get('/cash', controller.getCash);
router.get('/cash/:id', controller.getCashById);
router.post('/cash', controller.postCash);
router.put('/cash/:id', controller.putCash);
router.delete('/cash/:id', controller.deleteCash);

router.get('/zis', controller.getZis);
router.get('/zis/:id', controller.getZisById);
router.post('/zis', controller.postZis);
router.put('/zis/:id', controller.putZis);
router.delete('/zis/:id', controller.deleteZis);

router.get('/summary', controller.getSummary);

export default router;