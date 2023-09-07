import { CreateCandidateReqBody, UpdateCandidateReqBody } from '~/models/requests/Candidate.request'
import databaseServices from './database.services'
import Candidate, { CandidateType } from '~/models/schemas/Candidate.schema'
import { ObjectId } from 'mongodb'

class CandidateService {
  static async createCandidate(userId: string, payload: CreateCandidateReqBody) {
    const result = await databaseServices.candidate.insertOne(
      new Candidate({
        ...payload,
        user_id: new ObjectId(userId),
        cv_id: new ObjectId(payload.cv_id)
      })
    )

    return {
      message: 'created candidate successfully'
    }
  }

  static async getCandidate(userId: string) {
    const result = await databaseServices.candidate.findOne({
      user_id: new ObjectId(userId)
    })

    return result
  }

  static async updateCandidate(userId: string, payload: UpdateCandidateReqBody) {
    const _payload = (payload.cv_id ? { ...payload, cv_id: new ObjectId(payload.cv_id) } : payload) as CandidateType
    const result = await databaseServices.candidate.findOneAndUpdate(
      {
        user_id: new ObjectId(userId)
      },
      {
        $set: {
          ..._payload
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return {
      message: result.value ? 'Update successfully' : 'Update failed'
    }
  }

  static async publishCandidate(userId: string) {
    const result = await databaseServices.candidate.findOneAndUpdate(
      {
        user_id: new ObjectId(userId)
      },
      {
        $set: {
          cv_public: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return {
      message: result.value ? 'Update successfully' : 'Update failed'
    }
  }

  static async hideCandidate(userId: string) {
    const result = await databaseServices.candidate.findOneAndUpdate(
      {
        user_id: new ObjectId(userId)
      },
      {
        $set: {
          cv_public: false
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return {
      message: result.value ? 'Update successfully' : 'Update failed'
    }
  }
}

export default CandidateService
