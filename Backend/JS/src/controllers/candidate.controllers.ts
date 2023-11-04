import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserRole } from '~/constants/enums'
import { CreateCandidateReqBody, UpdateCandidateReqBody } from '~/models/requests/Candidate.request'
import { TokenPayload } from '~/models/requests/User.request'
import { NotificationObject } from '~/models/schemas/Notification.schema'
import CandidateService from '~/services/candidate.services'
import databaseServices from '~/services/database.services'
import NotificationService from '~/services/notification.services'

class CandidateController {
  async createCandidate(
    req: Request<ParamsDictionary, any, CreateCandidateReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { user_id } = req.decoded_authorization
    const result = await CandidateService.updateCandidate(user_id, body)
    return res.json({
      message: result
    })
  }

  async updateCandidate(
    req: Request<ParamsDictionary, any, UpdateCandidateReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { body } = req
    const { user_id } = req.decoded_authorization
    const result = await CandidateService.updateCandidate(user_id, body)
    return res.json({
      message: result
    })
  }

  async getCandidate(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const result = await CandidateService.getCandidate(user_id)
    return res.json({
      message: 'get candidate',
      result
    })
  }

  async publishCandidate(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const result = await CandidateService.publishCandidate(user_id)
    return res.json({
      message: result
    })
  }

  async hideCandidate(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const result = await CandidateService.hideCandidate(user_id)
    return res.json({
      message: result
    })
  }

  async getCandidateById(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id, role } = req.decoded_authorization as TokenPayload

    const candidate_id = req.params.candidate_id

    const result = await CandidateService.getCandidateById(candidate_id, user_id)
    if (role === UserRole.Employer && result) {
      const company = await databaseServices.company.findOne({
        'users.user_id': new ObjectId(user_id)
      })
      await NotificationService.notify({
        recievers: [user_id],
        content: `Nhà tuyển dụng ${company?.company_name} đã xem hồ sơ của bạn`,
        object_recieve: NotificationObject.Candidate,
        type: 'cv/seen'
      })
    }

    return res.json({
      message: 'get candidate',
      result
    })
  }
}

export default new CandidateController()
