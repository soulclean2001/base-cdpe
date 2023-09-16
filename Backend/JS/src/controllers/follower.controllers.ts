import { NextFunction, Request, Response } from 'express'
import FollowerService from '~/services/follower.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { CompanyFollowerReqBody, ResumeFollowerReqBody } from '~/models/requests/Follower.request'

class FollowerController {
  async followResume(req: Request<ParamsDictionary, any, ResumeFollowerReqBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { resume_id } = req.body
    const result = await FollowerService.followResume(user_id, resume_id)

    return res.json(result)
  }

  async unfollowResume(req: Request<ParamsDictionary, any, ResumeFollowerReqBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { resume_id } = req.body
    const result = await FollowerService.unfollowResume(user_id, resume_id)

    return res.json(result)
  }

  async followRecruiter(
    req: Request<ParamsDictionary, any, CompanyFollowerReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.decoded_authorization
    const { company_id } = req.body
    const result = await FollowerService.followRecruiter(user_id, company_id)

    return res.json(result)
  }

  async unfollowRecruiter(
    req: Request<ParamsDictionary, any, CompanyFollowerReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.decoded_authorization
    const { company_id } = req.body
    const result = await FollowerService.unfollowRecruiter(user_id, company_id)

    return res.json(result)
  }

  async getResumesFollowedCompany(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const result = await FollowerService.getResumesFollowedCompany(user_id)

    return res.json({
      message: 'List resumes for company following',
      result
    })
  }

  async getCompaniesFollowedUser(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const result = await FollowerService.getCompaniesFollowedUser(user_id)

    return res.json({
      result,
      message: 'List companies for user following'
    })
  }
}

export default new FollowerController()
