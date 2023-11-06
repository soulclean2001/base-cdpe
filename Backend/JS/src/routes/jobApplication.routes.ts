import express from 'express'
import jobApplicationControllers from '~/controllers/jobApplication.controllers'
import {
  applyJobValidator,
  idValidator,
  jobApplicationQueryMiddleware,
  updateStatusValidator
} from '~/middlewares/jobApplication.middlewares'
import { accessTokenValidator, isCandidate, isEmployer } from '~/middlewares/users.middlewares'
const jobApplicationRouter = express.Router()

jobApplicationRouter.post('/', accessTokenValidator, applyJobValidator, jobApplicationControllers.applyJob)

jobApplicationRouter.post(
  '/approve/:job_application_id',
  accessTokenValidator,
  idValidator('job_application_id'),
  jobApplicationControllers.appove
)
jobApplicationRouter.post(
  '/reject/:job_application_id',
  accessTokenValidator,
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

jobApplicationRouter.get(
  '/',
  accessTokenValidator,
  jobApplicationQueryMiddleware,
  jobApplicationControllers.getJobApplicationsByFilter
)

jobApplicationRouter.get(
  '/list-chat-users',
  accessTokenValidator,
  isCandidate,
  jobApplicationControllers.getInfoJobsAppliedByUserId
)

jobApplicationRouter.get(
  '/list-chat-company',
  accessTokenValidator,
  isEmployer,
  jobApplicationControllers.getInfoJobsAppliedByCompany
)

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

/**
 * 
 * {
    "message": "Check me is applied",
    "result": {
        "is_applied": true
    }
}
 */

jobApplicationRouter.get('/me/applied/:post_id', accessTokenValidator, jobApplicationControllers.checkIsApplied)

export default jobApplicationRouter
