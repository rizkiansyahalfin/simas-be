import { Router } from 'express';
import { AuditAction } from '../../generated/client'
import * as jumatScheduleController from './jumat-schedule.controller';
import { asyncHandler } from '../../utils/async-handler';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { auditMiddleware } from '../audit/audit.middleware';

const router = Router();

router.get('/', authMiddleware, asyncHandler(jumatScheduleController.getAll));
router.get('/:id', authMiddleware, asyncHandler(jumatScheduleController.getById));
router.post(
  '/',
  authMiddleware,
  auditMiddleware({
    action: AuditAction.create,
    module: 'jumat-schedules',
  }),
  asyncHandler(jumatScheduleController.create)
);
router.put(
  '/:id',
  authMiddleware,
  auditMiddleware({
    action: AuditAction.update,
    module: 'jumat-schedules',
  }),
  asyncHandler(jumatScheduleController.update)
);

export default router;