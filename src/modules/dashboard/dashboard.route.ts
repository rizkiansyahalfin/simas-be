// dashboard.route.ts

import { Router } from 'express';

import * as dashboardController from './dashboard.controller';
import { asyncHandler } from '../../utils/async-handler';
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
  asyncHandler(dashboardController.getDashboardStats)
)

router.get(
  '/charts/finance',
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  asyncHandler(dashboardController.getFinanceChart)
)

router.get(
  '/charts/donations',
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  asyncHandler(dashboardController.getDonationChart)
)
router.get(
  '/charts/zis',
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  asyncHandler(dashboardController.getZisChart)
);
router.get(
  '/charts/donations',
  rbacMiddleware(
    Role.superadmin,
    Role.bendahara
  ),
  asyncHandler(dashboardController.getDonationChart)
);

export default router;