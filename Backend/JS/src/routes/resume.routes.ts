import { Router } from 'express'
import resumeControllers from '~/controllers/resume.controllers'
import { createResumeValidator } from '~/middlewares/resume.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const resumeRouter = Router()

// resumeRouter.post('/', accessTokenValidator, createResumeValidator, wrapAsync(resumeControllers.createResume))
// resumeRouter.patch(
//   '/:resume_id',
//   accessTokenValidator,
//   createResumeValidator,
//   wrapAsync(resumeControllers.updateResume)
// )

resumeRouter.post('/me', accessTokenValidator, createResumeValidator, wrapAsync(resumeControllers.updateOrCreateResume))

resumeRouter.delete('/:resume_id', accessTokenValidator, wrapAsync(resumeControllers.deleteResume))
resumeRouter.get('/me/:resume_id', accessTokenValidator, wrapAsync(resumeControllers.getResumeByMe))
resumeRouter.get('/me', accessTokenValidator, wrapAsync(resumeControllers.getAllResumesByMe))
resumeRouter.get('/all', accessTokenValidator, wrapAsync(resumeControllers.getAllResumes))

export default resumeRouter
