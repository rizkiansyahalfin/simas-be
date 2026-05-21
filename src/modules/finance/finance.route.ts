import { Router } from 'express';
import * as controller from './finance.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rbacMiddleware } from '../../middlewares/rbac.middleware';
import { auditMiddleware } from '../audit/audit.middleware';
import { Role } from '../../generated/enums';

const router = Router();

router.get('/cash', controller.getCash);
router.get('/cash/:id', controller.getCashById);
router.post(
  '/cash',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'create', module: 'finance.cash' }),
  controller.postCash
);
router.put(
  '/cash/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'update', module: 'finance.cash' }),
  controller.putCash
);
router.delete(
  '/cash/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'delete', module: 'finance.cash' }),
  controller.deleteCash
);

router.get('/zis', controller.getZis);
router.get('/zis/:id', controller.getZisById);
router.post(
  '/zis',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'create', module: 'finance.zis' }),
  controller.postZis
);
router.put(
  '/zis/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'update', module: 'finance.zis' }),
  controller.putZis
);
router.delete(
  '/zis/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'delete', module: 'finance.zis' }),
  controller.deleteZis
);

router.get('/summary', controller.getSummary);

export default router;