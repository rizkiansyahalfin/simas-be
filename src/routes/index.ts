import { Router, Request, Response } from 'express'

import financeRouter from '../modules/finance/finance.route'
import authRoutes from '../modules/auth/auth.route'
import userRoutes from '../modules/auth/user.route'
import jumatScheduleRouter from '../modules/jumat-schedules/jumat-schedules.route'
import congregationRouter from '../modules/congregation/congregation.route'
import inventoryRouter from '../modules/inventory/inventory.route'
import inventoryLoanRouter from '../modules/inventory-loan/inventory-loan.route'
import eventRouter from '../modules/events/event.route'
import reportsRouter from '../modules/reports/reports.route'
import articleRiuter from "../modules/articles/article.route"
import donationRouter from '../modules/donations/donation.route'
import mustahikRouter from '../modules/mustahik/mustahik.route'
import distributionRouter from '../modules/mustahik-distribution/distribution.route'
import prayerRouter from '../modules/prayer/prayer.route'
import usersRouter from '../modules/users/user.route'
import dashboardRouter from '../modules/dashboard/dashboard.route'
import mosqueprofileRouter from '../modules/mosque-profile/mosque-profile.route'
import auditRouter from '../modules/audit/audit.route'
import campaignRouter from '../modules/campaign/campaign.route'

const router = Router()

router.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'API jalan 🚀'
  })
})

router.use('/finance', financeRouter)
router.use('/auth', authRoutes)
router.use('/auth', userRoutes)
router.use('/jumat-schedules', jumatScheduleRouter)
router.use('/congregation', congregationRouter)
router.use('/inventory', inventoryRouter)
router.use('/inventory-loan', inventoryLoanRouter)
router.use('/events', eventRouter)
router.use('/reports', reportsRouter)
router.use("/articles", articleRiuter)
router.use('/donations', donationRouter)
router.use('/mustahik', mustahikRouter)
router.use('/mustahik-distribution', distributionRouter)
router.use('/prayer', prayerRouter)
router.use('/users', usersRouter)
router.use('/dashboard', dashboardRouter)
router.use('/mosque-profile', mosqueprofileRouter)
router.use('/campaigns', campaignRouter)
router.use('/audit', auditRouter)
export default router