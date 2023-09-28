import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import TrackedCandidate from '~/models/schemas/TrackedCandidate.schema'
import { ErrorWithStatus } from '~/models/Errors'

export default class TrackedCandidateService {
  static async trackedCandidate(userId: string, candidateId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Could not find company',
        status: 404
      })
    }

    const result = await databaseServices.candidate.findOne({
      _id: new ObjectId(candidateId)
    })

    if (result) {
      await databaseServices.trackedCandidate.insertOne(
        new TrackedCandidate({
          candidate_id: new ObjectId(candidateId),
          company_id: company._id
        })
      )
    }

    return {
      message: 'tracked candidate'
    }
  }

  static async untrackedCandidate(userId: string, candidateId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Could not find company',
        status: 404
      })
    }

    const result = await databaseServices.candidate.findOne({
      _id: new ObjectId(candidateId)
    })

    if (result) {
      await databaseServices.trackedCandidate.findOneAndDelete(
        new TrackedCandidate({
          candidate_id: new ObjectId(candidateId),
          company_id: company._id
        })
      )
    }

    return {
      message: 'delete tracked candidate'
    }
  }
}
