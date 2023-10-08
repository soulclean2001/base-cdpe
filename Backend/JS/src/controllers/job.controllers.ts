import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.request'
import { CreateJobBody, PublishJobBody, UpdateJobReqBody } from '~/models/requests/Job.request'
import JobService, { JobSearchOptions } from '~/services/job.services'
import { isBoolean } from 'lodash'

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

  async updateJob(req: Request<ParamsDictionary, any, UpdateJobReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { job_id } = req.params
    const result = await JobService.updateJob({ userId: user_id, jobId: job_id, payload: req.body })
    return res.json(result)
  }

  async approveJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { job_id } = req.params
    const result = await JobService.approveJob(job_id)
    return res.json(result)
  }

  async rejectJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { job_id } = req.params
    const result = await JobService.rejectJob(job_id)
    return res.json(result)
  }

  async getJob(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { job_id } = req.params
    const result = await JobService.getJob(job_id)
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
    const intLimit = !isNaN(Number(limit)) ? Number(limit) : 2
    const intPage = !isNaN(Number(page)) ? Number(page) : 1

    const result = await JobService.getAllJobByCompany(user_id, intLimit, intPage)
    return res.json({
      message: 'All jobs by company',
      result
    })
  }

  async getJobByCompany(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { limit, page, expired_before_nday, visibility, status } = req.query
    const intLimit = !isNaN(Number(limit)) ? Number(limit) : 2
    const intPage = !isNaN(Number(page)) ? Number(page) : 1
    const options: JobSearchOptions = {}
    options.expired_before_nday = !isNaN(Number(expired_before_nday)) ? Number(expired_before_nday) : undefined
    options.visibility = isBoolean(Boolean(visibility)) ? Boolean(visibility) : undefined
    options.status = !isNaN(Number(status)) ? Number(status) : undefined

    const result = await JobService.getJobByCompany(user_id, intLimit, intPage, options)
    return res.json({
      message: 'All jobs by company',
      result
    })
  }
}

export default new JobController()
