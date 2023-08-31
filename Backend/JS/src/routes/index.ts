import express from 'express'
import usersRouter from './users.routes'
import mediasRouter from './medias.routes'
import companyRouter from './company.routes'
import jobRouter from './job.routes'
import resumeRouter from './resume.routes'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/medias', mediasRouter)
router.use('/company', companyRouter)
router.use('/jobs', jobRouter)
router.use('/resumes', resumeRouter)

export default router
