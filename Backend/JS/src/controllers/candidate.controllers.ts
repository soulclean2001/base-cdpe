import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateCandidateReqBody, UpdateCandidateReqBody } from '~/models/requests/Candidate.request'
import CandidateService from '~/services/candidate.services'

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
    const candidate_id = req.params.candidate_id

    const result = await CandidateService.getCandidateById(candidate_id)
    return res.json({
      message: 'get candidate',
      result
    })
  }
}

export default new CandidateController()
