import { CreateCandidateReqBody, UpdateCandidateReqBody } from '~/models/requests/Candidate.request'
import databaseServices from './database.services'
import Candidate, { CandidateType } from '~/models/schemas/Candidate.schema'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'

class CandidateService {
  // static async createCandidate(userId: string, payload: CreateCandidateReqBody) {
  //   const result = await databaseServices.candidate.insertOne(
  //     new Candidate({
  //       ...payload,
  //       user_id: new ObjectId(userId),
  //       cv_id: new ObjectId(payload.cv_id)
  //     })
  //   )

  //   return {
  //     message: 'created candidate successfully'
  //   }
  // }

  static async getCandidate(userId: string) {
    const result = await databaseServices.candidate.findOne({
      user_id: new ObjectId(userId)
    })

    return result
  }

  static async getCandidateById(candidateId: string, userId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'Could not find company',
        status: 404
      })

    const result = await databaseServices.candidate
      .aggregate([
        {
          $match: {
            _id: new ObjectId(candidateId),
            cv_public: true
          }
        },
        {
          $lookup: {
            from: 'resumes',
            localField: 'cv_id',
            foreignField: '_id',
            as: 'cv'
          }
        },
        {
          $unwind: {
            path: '$cv'
          }
        },
        {
          $lookup: {
            from: 'tracked_candidates',
            localField: '_id',
            foreignField: 'candidate_id',
            as: 'company_following'
          }
        },
        {
          $addFields: {
            is_follwing: {
              $in: [company._id, '$company_following.company_id']
            }
          }
        },
        {
          $project: {
            company_following: 0
          }
        }
      ])
      .toArray()

    return result[0] || {}
  }

  static async updateCandidate(userId: string, payload: UpdateCandidateReqBody) {
    const cv = await databaseServices.resume.findOne({
      user_id: new ObjectId(userId)
    })

    if (!cv) {
      throw new ErrorWithStatus({
        message: 'You must be have an resume before',
        status: 404
      })
    }

    // const _payload = (payload.cv_id ? { ...payload, cv_id: new ObjectId(payload.cv_id) } : payload) as CandidateType
    const _payload = { ...payload, cv_id: cv._id } as CandidateType
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
