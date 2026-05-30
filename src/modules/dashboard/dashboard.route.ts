// dashboard.route.ts

import { Router } from 'express';

import * as dashboardController from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rbacMiddleware } from '../../middlewares/rbac.middleware';
import { Role } from '../../generated/enums';

const router = Router();

router.use(authMiddleware)

router.get(
  '/stats',
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  dashboardController.getDashboardStats
)

router.get(
  '/charts/finance',
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  dashboardController.getFinanceChart
)

router.get(
  '/charts/donations',
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  dashboardController.getDonationChart
)

export default router;