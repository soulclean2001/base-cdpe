import { Router } from 'express'
import resumeControllers from '~/controllers/resume.controllers'
import { createResumeValidator } from '~/middlewares/resume.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const resumeRouter = Router()

resumeRouter.post('/', accessTokenValidator, createResumeValidator, resumeControllers.createResume)

export default resumeRouter
