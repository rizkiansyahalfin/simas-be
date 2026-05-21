import { Router } from 'express';
import { AuditAction } from '../../generated/client'
import * as jumatScheduleController from './jumat-schedule.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { auditMiddleware } from '../audit/audit.middleware';

const router = Router();

router.get('/', authMiddleware, jumatScheduleController.getAll);
router.get('/:id', authMiddleware, jumatScheduleController.getById);
router.post(
  '/',
  authMiddleware,
  auditMiddleware({
    action: AuditAction.create,
    module: 'jumat-schedules',
  }),
  jumatScheduleController.create
);
router.put(
  '/:id',
  authMiddleware,
  auditMiddleware({
    action: AuditAction.update,
    module: 'jumat-schedules',
  }),
  jumatScheduleController.update
);

export default router;