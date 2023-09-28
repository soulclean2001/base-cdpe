import express from 'express'
import jobApplicationControllers from '~/controllers/jobApplication.controllers'
import { applyJobValidator, idValidator, updateStatusValidator } from '~/middlewares/jobApplication.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
const jobApplicationRouter = express.Router()

jobApplicationRouter.post('/', accessTokenValidator, applyJobValidator, jobApplicationControllers.applyJob)
jobApplicationRouter.get(
  '/get-all-by-post/:post_id',
  accessTokenValidator,
  idValidator('post_id'),
  jobApplicationControllers.getAllJobApplicationsByPost
)
jobApplicationRouter.get(
  '/get-all-from-candidate',
  accessTokenValidator,
  jobApplicationControllers.getAllJobApplicationsFromCandidate
)
jobApplicationRouter.get(
  '/:job_application_id',
  accessTokenValidator,
  idValidator('job_application_id'),
  jobApplicationControllers.getById
)
jobApplicationRouter.post(
  '/approve/:job_application_id',
  accessTokenValidator,
  applyJobValidator,
  idValidator('job_application_id'),
  jobApplicationControllers.appove
)
jobApplicationRouter.post(
  '/reject/:job_application_id',
  accessTokenValidator,
  applyJobValidator,
  idValidator('job_application_id'),
  jobApplicationControllers.reject
)

jobApplicationRouter.post(
  '/update-status/:job_application_id',
  accessTokenValidator,
  updateStatusValidator,
  idValidator('job_application_id'),
  jobApplicationControllers.updateStatus
)

export default jobApplicationRouter
