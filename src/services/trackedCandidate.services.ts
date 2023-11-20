import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import TrackedCandidate from '~/models/schemas/TrackedCandidate.schema'
import { ErrorWithStatus } from '~/models/Errors'
import { escapeRegExp } from 'lodash'

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
      const candidate = await databaseServices.trackedCandidate.findOneAndUpdate(
        {
          candidate_id: new ObjectId(candidateId),
          company_id: company._id
        },
        {
          $set: {}
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      )

      return candidate
    }

    return {}
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
      await databaseServices.trackedCandidate.findOneAndDelete({
        candidate_id: new ObjectId(candidateId),
        company_id: company._id
      })
    }

    return 'delete tracked candidate'
  }

  static async getListTrackedCandidate(userId: string, filter: { name?: string; limit?: string; page?: string }) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const options: {
      [key: string]: any
    } = {}

    if (filter.name) {
      const keyword = filter.name.trim()
      const keywords = keyword.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')
      options['candidate_name'] = {
        $regex: regex
      }
    }

    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Could not find company',
        status: 404
      })
    }

    const [list, total] = await Promise.all([
      databaseServices.trackedCandidate
        .aggregate([
          {
            $match: {
              company_id: company._id
            }
          },
          {
            $lookup: {
              from: 'candidates',
              localField: 'candidate_id',
              foreignField: '_id',
              as: 'candidate'
            }
          },
          {
            $unwind: {
              path: '$candidate'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'candidate.user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $lookup: {
              from: 'resumes',
              localField: 'user._id',
              foreignField: 'user_id',
              as: 'cv'
            }
          },
          {
            $unwind: {
              path: '$cv'
            }
          },
          {
            $addFields: {
              candidate_name: '$user.name',
              cv_info: {
                avatar: '$cv.user_info.avatar',
                wanted_job_title: '$cv.user_info.wanted_job_title',
                updated_at: '$cv.updated_at'
              }
            }
          },
          {
            $project: {
              user: 0,
              cv: 0
            }
          },
          {
            $match: {
              ...options
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.trackedCandidate
        .aggregate([
          {
            $match: {
              company_id: company._id
            }
          },
          {
            $lookup: {
              from: 'candidates',
              localField: 'candidate_id',
              foreignField: '_id',
              as: 'candidate'
            }
          },
          {
            $unwind: {
              path: '$candidate'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'candidate.user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $addFields: {
              candidate_name: '$user.name',
              avatar: '$user.avatar'
            }
          },
          {
            $match: {
              ...options
            }
          },

          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      list,
      total: total[0]?.total || 0,
      page,
      limit
    }
  }
}
