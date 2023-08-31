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
}

export default new ResumeController()
