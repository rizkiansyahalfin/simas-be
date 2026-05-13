import { Router, Request, Response } from 'express'

import financeRouter from '../modules/finance/finance.route'
import authRoutes from '../modules/auth/user.route'
import jumatScheduleRouter from '../modules/jumat-schedules/jumat-schedules.route'
import congregationRouter from '../modules/congregation/congregation.route'
import inventoryRouter from '../modules/inventory/inventory.route'
import inventoryLoanRouter from '../modules/inventory-loan/inventory-loan.route'
import eventRouter from '../modules/events/event.route'

const router = Router()

router.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'API jalan 🚀'
  })
})

router.use('/finance', financeRouter)
router.use('/auth', authRoutes)
router.use('/jumat-schedules', jumatScheduleRouter)
router.use('/congregation', congregationRouter)
router.use('/inventory', inventoryRouter)
router.use('/inventory-loan', inventoryLoanRouter)
router.use('/events', eventRouter)

export default router