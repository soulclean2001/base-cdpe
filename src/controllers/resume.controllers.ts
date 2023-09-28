import { body } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import ResumeService from '~/services/resume.services'
import { ResumeRequestBody } from '~/models/requests/Resume.request'
import { ParamsDictionary } from 'express-serve-static-core'

class ResumeController {
  async createResume(req: Request<ParamsDictionary, any, ResumeRequestBody>, res: Response, next: NextFunction) {
    const { body } = req
    const { user_id } = req.decoded_authorization
    // const result = body
    const result = await ResumeService.createResume(user_id, body)

    return res.json({
      message: 'create resume',
      result
    })
  }

  async updateOrCreateResume(
    req: Request<ParamsDictionary, any, ResumeRequestBody>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { user_id } = req.decoded_authorization
    const result = await ResumeService.updateOrCreateResume(user_id, body)

    return res.json({
      message: 'updated resume',
      result
    })
  }

  async updateResume(req: Request<ParamsDictionary, any, ResumeRequestBody>, res: Response, next: NextFunction) {
    const { body } = req
    const { resume_id } = req.params
    const { user_id } = req.decoded_authorization
    const result = await ResumeService.updateResume(user_id, resume_id, body)

    return res.json({
      message: 'updated resume',
      result
    })
  }

  async deleteResume(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { resume_id } = req.params
    const { user_id } = req.decoded_authorization
    const result = await ResumeService.deleteResume(user_id, resume_id)

    return res.json({
      message: 'deleted resume',
      result
    })
  }

  async getResumeByMe(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { resume_id } = req.params
    const { user_id } = req.decoded_authorization
    const result = await ResumeService.getResumeByMe(user_id, resume_id)

    return res.json({
      message: 'get resume',
      result
    })
  }

  async getAllResumesByMe(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const result = await ResumeService.getAllResumesByMe(user_id)

    return res.json({
      message: 'get all resume',
      result
    })
  }

  async getAllResumes(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const result = await ResumeService.getAllResumes()

    return res.json({
      message: 'get all resume',
      result
    })
  }
}

export default new ResumeController()
