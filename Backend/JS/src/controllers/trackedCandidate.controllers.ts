import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import trackedCandidateService from '~/services/trackedCandidate.services'

class TrackedCandidateController {
  async trackedCandidate(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { candidate_id } = req.body
    const { user_id } = req.decoded_authorization as TokenPayload

    if (!ObjectId.isValid(candidate_id))
      throw new ErrorWithStatus({
        message: 'Invalid candidate identifier',
        status: 422
      })
    const result = await trackedCandidateService.trackedCandidate(user_id, candidate_id)

    return res.json({
      message: 'followed candidate',
      result
    })
  }

  async untrackedCandidate(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { candidate_id } = req.body
    const { user_id } = req.decoded_authorization as TokenPayload

    if (!ObjectId.isValid(candidate_id))
      throw new ErrorWithStatus({
        message: 'Invalid candidate identifier',
        status: 422
      })
    const result = await trackedCandidateService.untrackedCandidate(user_id, candidate_id)

    return res.json({
      message: 'unfollow candidate',
      result
    })
  }

  async getListTrackedCandidate(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload

    const result = await trackedCandidateService.getListTrackedCandidate(user_id, req.query)

    return res.json({
      message: 'list tracked candidate',
      result
    })
  }
}

export default new TrackedCandidateController()
