import express from 'express'
import usersRouter from './users.routes'
import mediasRouter from './medias.routes'
import companyRouter from './company.routes'
import jobRouter from './job.routes'
import resumeRouter from './resume.routes'
import followerRouter from './follower.routes'
import packageRouter from './package.routes'
import cartRouter from './cart.routes'
import conversationsRouter from './conversations.routes'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/medias', mediasRouter)
router.use('/company', companyRouter)
router.use('/jobs', jobRouter)
router.use('/resumes', resumeRouter)
router.use('/followers', followerRouter)
router.use('/packages', packageRouter)
router.use('/carts', cartRouter)
router.use('/conversations', conversationsRouter)

export default router
