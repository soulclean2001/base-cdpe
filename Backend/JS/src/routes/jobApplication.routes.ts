import express from 'express'
import jobApplicationControllers from '~/controllers/jobApplication.controllers'
import {
  applyJobValidator,
  idValidator,
  jobApplicationQueryMiddleware,
  updateProfileStatusValidator,
  updateStatusValidator
} from '~/middlewares/jobApplication.middlewares'
import { accessTokenValidator, isCandidate, isEmployer } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'
const jobApplicationRouter = express.Router()

jobApplicationRouter.post('/', accessTokenValidator, applyJobValidator, wrapAsync(jobApplicationControllers.applyJob))

jobApplicationRouter.post(
  '/approve/:job_application_id',
  accessTokenValidator,
  idValidator('job_application_id'),
  wrapAsync(jobApplicationControllers.appove)
)
jobApplicationRouter.post(
  '/reject/:job_application_id',
  accessTokenValidator,
  idValidator('job_application_id'),
  wrapAsync(jobApplicationControllers.reject)
)

jobApplicationRouter.post(
  '/update-status/:job_application_id',
  accessTokenValidator,
  isEmployer,
  updateStatusValidator,
  idValidator('job_application_id'),
  wrapAsync(jobApplicationControllers.updateStatus)
)

// update profile status [available, archived, deleted]
jobApplicationRouter.post(
  '/update-profile-status/:job_application_id',
  accessTokenValidator,
  isEmployer,
  updateProfileStatusValidator,
  idValidator('job_application_id'),
  wrapAsync(jobApplicationControllers.updateProfileStatus)
)

jobApplicationRouter.get(
  '/',
  accessTokenValidator,
  jobApplicationQueryMiddleware,
  wrapAsync(jobApplicationControllers.getJobApplicationsByFilter)
)

jobApplicationRouter.get(
  '/list-chat-users',
  accessTokenValidator,
  isCandidate,
  wrapAsync(jobApplicationControllers.getInfoJobsAppliedByUserId)
)

jobApplicationRouter.get(
  '/list-chat-company',
  accessTokenValidator,
  isEmployer,
  wrapAsync(jobApplicationControllers.getInfoJobsAppliedByCompany)
)

jobApplicationRouter.get(
  '/get-all-by-post/:post_id',
  accessTokenValidator,
  idValidator('post_id'),
  wrapAsync(jobApplicationControllers.getAllJobApplicationsByPost)
)
jobApplicationRouter.get(
  '/get-all-from-candidate',
  accessTokenValidator,
  wrapAsync(jobApplicationControllers.getAllJobApplicationsFromCandidate)
)

jobApplicationRouter.get(
  '/:job_application_id',
  accessTokenValidator,
  idValidator('job_application_id'),
  wrapAsync(jobApplicationControllers.getById)
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

jobApplicationRouter.get(
  '/me/applied/:post_id',
  accessTokenValidator,
  wrapAsync(jobApplicationControllers.checkIsApplied)
)

export default jobApplicationRouter
