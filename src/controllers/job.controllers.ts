import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.request'
import { CreateJobBody, PublishJobBody, UpdateJobReqBody } from '~/models/requests/Job.request'
import JobService, { JobSearchOptions } from '~/services/job.services'
import { isBoolean } from 'lodash'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'

class JobController {
  async createJob(req: Request<ParamsDictionary, any, CreateJobBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await JobService.createJob({ userId: user_id, payload: req.body })
    return res.json(result)
  }

  async publishJob(req: Request<ParamsDictionary, any, PublishJobBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { job_id } = req.params
    const { expired_date } = req.body
    const result = await JobService.publish({ userId: user_id, jobId: job_id, expiredDate: expired_date })
    return res.json(result)
  }

  async hideJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { job_id } = req.params
    const result = await JobService.hide({ userId: user_id, jobId: job_id })
    return res.json(result)
  }

  async deleteJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { job_id } = req.params
    const result = await JobService.deleteJob({ userId: user_id, jobId: job_id })
    return res.json(result)
  }

  async removeJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { job_id } = req.params
    const result = await JobService.removeJob({ userId: user_id, jobId: job_id })
    return res.json(result)
  }

  async updateJob(req: Request<ParamsDictionary, any, UpdateJobReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { job_id } = req.params
    const result = await JobService.updateJob({ userId: user_id, jobId: job_id, payload: req.body })
    return res.json(result)
  }

  async approveJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload

    const { job_id } = req.params
    const result = await JobService.approveJob(job_id)
    return res.json(result)
  }

  async rejectJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload

    const { job_id } = req.params
    const result = await JobService.rejectJob(job_id)
    return res.json(result)
  }

  async getJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { job_id } = req.params
    const { user_id } = req.query

    if (user_id && !ObjectId.isValid(user_id as string)) {
      throw new ErrorWithStatus({
        message: 'Invalid user ID',
        status: 422
      })
    }
    const result = await JobService.getJob(job_id, user_id as string)
    return res.json({
      message: 'Get Job',
      result
    })
  }

  async getAllJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const result = await JobService.getAllJob()
    return res.json({
      message: 'Get Job',
      result
    })
  }

  async getAllJobByCompany(req: Request<ParamsDictionary, any, UpdateJobReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { limit, page } = req.query
    const intLimit = !isNaN(Number(limit)) ? Number(limit) : 10
    const intPage = !isNaN(Number(page)) ? Number(page) : 1

    const result = await JobService.getAllJobByCompany(user_id, intLimit, intPage)
    return res.json({
      message: 'All jobs by company',
      result
    })
  }

  async getJobsByCompany(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { limit, page, expired_before_nday, visibility, status } = req.query
    const intLimit = !isNaN(Number(limit)) ? Number(limit) : 10
    const intPage = !isNaN(Number(page)) ? Number(page) : 1
    const options: JobSearchOptions = req.query
    // options.expired_before_nday = !isNaN(Number(expired_before_nday)) ? Number(expired_before_nday) : undefined
    // options.visibility = isBoolean(Boolean(visibility)) ? Boolean(visibility) : undefined
    // options.status = !isNaN(Number(status)) ? Number(status) : undefined

    const result = await JobService.getJobByCompany(user_id, intLimit, intPage, options)
    return res.json({
      message: 'All jobs by company',
      result
    })
  }

  async getAllJobsApplied(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { limit, page } = req.query
    const intLimit = !isNaN(Number(limit)) ? Number(limit) : 10
    const intPage = !isNaN(Number(page)) ? Number(page) : 1
    // options.expired_before_nday = !isNaN(Number(expired_before_nday)) ? Number(expired_before_nday) : undefined
    // options.visibility = isBoolean(Boolean(visibility)) ? Boolean(visibility) : undefined
    // options.status = !isNaN(Number(status)) ? Number(status) : undefined

    const result = await JobService.getAllJobApplied(user_id, intLimit, intPage)
    return res.json({
      message: 'All jobs by user have been applied',
      result
    })
  }

  async getAllJobsByCompanyId(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { company_id } = req.params
    // options.expired_before_nday = !isNaN(Number(expired_before_nday)) ? Number(expired_before_nday) : undefined
    // options.visibility = isBoolean(Boolean(visibility)) ? Boolean(visibility) : undefined
    // options.status = !isNaN(Number(status)) ? Number(status) : undefined
    if (!ObjectId.isValid(company_id as string))
      return res.json({
        message: 'All jobs by company',
        result: []
      })
    const result = await JobService.getAllJobsByCompanyId(company_id as string)
    return res.json({
      message: 'All jobs by company',
      result
    })
  }

  async getAllJobsPublishedByCompanyId(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { company_id } = req.params
    // options.expired_before_nday = !isNaN(Number(expired_before_nday)) ? Number(expired_before_nday) : undefined
    // options.visibility = isBoolean(Boolean(visibility)) ? Boolean(visibility) : undefined
    // options.status = !isNaN(Number(status)) ? Number(status) : undefined
    if (!ObjectId.isValid(company_id as string))
      return res.json({
        message: 'All jobs by company',
        result: []
      })
    const result = await JobService.getAllJobsPublishedByCompanyId(company_id as string)
    return res.json({
      message: 'All jobs by company',
      result
    })
  }

  async getTotalJobByCareer(req: Request<ParamsDictionary, any, any>, res: Response) {
    const result = await JobService.getTotalJobByCareer()
    return res.json({
      message: 'total job by career',
      result
    })
  }
}

export default new JobController()