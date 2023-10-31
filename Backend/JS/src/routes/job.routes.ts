import express from 'express'
import jobControllers from '~/controllers/job.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  createJobValidator,
  jobQueryMiddleware,
  publishJobValidator,
  updateJobValidator
} from '~/middlewares/job.middlewares'
import { accessTokenValidator, isAdmin } from '~/middlewares/users.middlewares'
import { UpdateJobReqBody } from '~/models/requests/Job.request'
import wrapAsync from '~/utils/handlers'
import { paginationValidator } from '~/utils/validation'

const jobRouter = express.Router()

jobRouter.get('/company', accessTokenValidator, jobQueryMiddleware, wrapAsync(jobControllers.getAllJobByCompany))
jobRouter.get('/applied', accessTokenValidator, paginationValidator, wrapAsync(jobControllers.getAllJobsApplied))
jobRouter.get('/company/filter', accessTokenValidator, jobQueryMiddleware, wrapAsync(jobControllers.getJobsByCompany))
jobRouter.get('/company/:company_id', wrapAsync(jobControllers.getAllJobsByCompanyId))
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
    'job_type',
    'job_requirement',
    'job_title',
    'pretty_salary',
    'salary_range',
    'skills',
    'visibility',
    'working_locations',
    'expired_date',
    'careers',
    'number_of_employees_needed',
    'application_email'
  ]),

  wrapAsync(jobControllers.updateJob)
)

export default jobRouter
