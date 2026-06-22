import { Router, Request, Response } from 'express'
import {startJumatReminderJob} from "../modules/jumat-schedules/jumat-reminder.job"
import { startInventoryOverdueJob } from "../modules/inventory-loan/inventory-overdue.job"
import { startPaymentRetryJob } from "../modules/payment/payment.cron"
import { BackupCron }from "../modules/backup/backup.cron"
import financeRouter from '../modules/finance/finance.route'
import authRoutes from '../modules/auth/auth.route'
import userRoutes from '../modules/auth/user.route'
import jumatScheduleRouter from '../modules/jumat-schedules/jumat-schedules.route'
import congregationRouter from '../modules/congregation/congregation.route'
import inventoryRouter from '../modules/inventory/inventory.route'
import inventoryLoanRouter from '../modules/inventory-loan/inventory-loan.route'
import inventoryCategoryRouter from '../modules/inventory-categories/inventory-category.route'
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
import notificationRouter from '../modules/notification/notification.route'
import articleCategoryRoute from '../modules/articles/article-category.route'
import paymentRoute from '../modules/payment/payment.route'
import attendanceRouter from '../modules/attendance/attendance.route'
import backupRouter from '../modules/backup/backup.route'
import galleryRouter from '../modules/gallery/gallery.route'
import healthRouter from '../modules/health/health.route'

const router = Router()

startJumatReminderJob()
startInventoryOverdueJob()
startPaymentRetryJob()
BackupCron.start()
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
router.use('/inventory-categories', inventoryCategoryRouter)
router.use('/events', eventRouter)
router.use('/reports', reportsRouter)
router.use('/gallery', galleryRouter)
router.use("/articles", articleRiuter)
router.use("/article-categories", articleCategoryRoute)
router.use('/donations', donationRouter)
router.use('/mustahik', mustahikRouter)
router.use('/mustahik-distribution', distributionRouter)
router.use('/prayer', prayerRouter)
router.use('/users', usersRouter)
router.use('/dashboard', dashboardRouter)
router.use('/mosque-profile', mosqueprofileRouter)
router.use('/campaigns', campaignRouter)
router.use('/audit', auditRouter)
router.use('/notifications', notificationRouter)
router.use('/attendance', attendanceRouter)
router.use("/payments", paymentRoute)
router.use("/backup", backupRouter)


router.use("/health", healthRouter)



export default router