import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { ApplyReqBody, UpdateStatusJobApplicationBody } from '~/models/requests/JobApplication.request'
import JobApplicationService from '~/services/jobApplication.services'

class JobApplicationController {
  async applyJob(req: Request<ParamsDictionary, any, ApplyReqBody>, res: Response, next: NextFunction) {
    const { body } = req
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.apply(user_id, body)

    return res.json({
      message: result
    })
  }

  async getAllJobApplicationsByPost(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { post_id } = req.params
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.getAllByPost(post_id)
    return res.json({
      message: 'get all job applications',
      result
    })
  }

  async getAllJobApplicationsFromCandidate(
    req: Request<ParamsDictionary, any, any>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.getFromCandidate(user_id)
    return res.json({
      message: 'get all job applications',
      result
    })
  }

  async getJobApplicationsByFilter(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.getJobAppications(user_id, req.query)
    return res.json({
      message: 'get job applications filter',
      result
    })
  }

  async getById(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { job_application_id } = req.params

    const result = await JobApplicationService.getById(user_id, job_application_id)
    return res.json({
      message: 'get job applications',
      result
    })
  }

  async appove(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { job_application_id } = req.params

    const result = await JobApplicationService.approve(job_application_id)
    return res.json({
      message: 'ok',
      result
    })
  }

  async reject(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { job_application_id } = req.params

    const result = await JobApplicationService.reject(job_application_id)
    return res.json({
      message: 'ok',
      result
    })
  }

  async updateStatus(
    req: Request<ParamsDictionary, any, UpdateStatusJobApplicationBody>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.decoded_authorization
    const { status } = req.body
    const { job_application_id } = req.params

    const result = await JobApplicationService.updateStatus(user_id, job_application_id, status)
    return res.json({
      message: 'ok',
      result
    })
  }

  async updateProfileStatus(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { profile_status } = req.body
    const { job_application_id } = req.params

    const result = await JobApplicationService.updateProfileStatus(user_id, job_application_id, profile_status)
    return res.json({
      message: 'ok',
      result
    })
  }

  async getInfoJobsAppliedByUserId(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.getInfoJobsAppliedByUserId(user_id)

    return res.json({
      message: 'JobApplication',
      result
    })
  }

  async getInfoJobsAppliedByCompany(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.getInfoJobsAppliedByCompany(user_id)

    return res.json({
      message: 'JobApplication',
      result
    })
  }

  async checkIsApplied(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { post_id } = req.params

    if (!ObjectId.isValid(post_id))
      throw new ErrorWithStatus({
        message: 'Invalid post ID',
        status: 422
      })
    const result = await JobApplicationService.checkIsApplied(user_id, post_id)

    return res.json({
      message: 'Check me is applied',
      result
    })
  }

  async totalJobApplication(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.totalJobApplication(user_id)

    return res.json({
      message: 'total job applied by company',
      result
    })
  }

  async getSummaryAllJobApplications(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { month, year } = req.query
    const { user_id } = req.decoded_authorization

    const result = await JobApplicationService.getSummaryAllJobApplications(user_id, {
      month: month as string,
      year: year as string
    })

    return res.json({
      message: '',
      result
    })
  }
}

export default new JobApplicationController()
