import { Router } from 'express';
import * as controller from './finance.controller';
import { asyncHandler } from '../../utils/async-handler';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rbacMiddleware } from '../../middlewares/rbac.middleware';
import { auditMiddleware } from '../audit/audit.middleware';
import { Role } from '../../generated/enums';

const router = Router();

router.get('/cash', asyncHandler(controller.getCash));
router.get('/cash/:id', asyncHandler(controller.getCashById));
router.post(
  '/cash',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'create', module: 'finance.cash' }),
  asyncHandler(controller.postCash)
);
router.put(
  '/cash/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'update', module: 'finance.cash' }),
  asyncHandler(controller.putCash)
);
router.delete(
  '/cash/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'delete', module: 'finance.cash' }),
  asyncHandler(controller.deleteCash)
);

router.get('/zis', asyncHandler(controller.getZis));
router.get('/zis/:id', asyncHandler(controller.getZisById));
router.post(
  '/zis',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'create', module: 'finance.zis' }),
  asyncHandler(controller.postZis)
);
router.put(
  '/zis/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'update', module: 'finance.zis' }),
  asyncHandler(controller.putZis)
);
router.delete(
  '/zis/:id',
  authMiddleware,
  rbacMiddleware(Role.superadmin, Role.bendahara),
  auditMiddleware({ action: 'delete', module: 'finance.zis' }),
  asyncHandler(controller.deleteZis)
);

router.get('/summary', asyncHandler(controller.getSummary));

export default router;