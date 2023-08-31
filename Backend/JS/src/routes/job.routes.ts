import express from 'express'
import jobControllers from '~/controllers/job.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { createJobValidator, publishJobValidator, updateJobValidator } from '~/middlewares/job.middlewares'
import { accessTokenValidator, isAdmin } from '~/middlewares/users.middlewares'
import { UpdateJobReqBody } from '~/models/requests/Job.request'
import wrapAsync from '~/utils/handlers'

const jobRouter = express.Router()

jobRouter.get('/company', accessTokenValidator, wrapAsync(jobControllers.getAllJobByCompany))
jobRouter.get('/:job_id', wrapAsync(jobControllers.getJob))
jobRouter.get('/', wrapAsync(jobControllers.getAllJob))
jobRouter.post('/', accessTokenValidator, createJobValidator, wrapAsync(jobControllers.createJob))

jobRouter.post('/:job_id/publish', accessTokenValidator, publishJobValidator, wrapAsync(jobControllers.publishJob))
jobRouter.post('/:job_id/approve', accessTokenValidator, isAdmin, wrapAsync(jobControllers.approveJob))
jobRouter.post('/:job_id/reject', accessTokenValidator, isAdmin, wrapAsync(jobControllers.rejectJob))
jobRouter.post('/:job_id/hide', accessTokenValidator, wrapAsync(jobControllers.hideJob))
jobRouter.delete('/:job_id', accessTokenValidator, wrapAsync(jobControllers.deleteJob))
jobRouter.patch(
  '/:job_id',
  accessTokenValidator,
  updateJobValidator,
  filterMiddleware<UpdateJobReqBody>([
    'alias',
    'benefits',
    'industries',
    'is_salary_visible',
    'job_description',
    'job_level',
    'job_requirement',
    'job_title',
    'pretty_salary',
    'salary_range',
    'skills',
    'visibility',
    'working_locations'
  ]),

  wrapAsync(jobControllers.updateJob)
)

export default jobRouter
