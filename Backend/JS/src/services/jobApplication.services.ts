import { ErrorWithStatus } from './../models/Errors'
import databaseServices from './database.services'
import Candidate from '~/models/schemas/Candidate.schema'
import { ObjectId } from 'mongodb'
import { ApplyReqBody } from '~/models/requests/JobApplication.request'
import JobApplication, {
  JobApplicationStatus,
  JobApplicationType,
  ApplyType
} from '~/models/schemas/JobApplication.schema'
import { isNumber, omit } from 'lodash'
import ConversationRoom from '~/models/schemas/ConversationRoom.schema'

export interface searchJobApplication {
  content?: string
  post_id?: string
  from_date?: string
  to_date?: string
  status?: string
  profile_status?: string
  limit?: string
  page?: string
}

class JobApplicationService {
  static async apply(userId: string, payload: ApplyReqBody) {
    let temp = {}
    if (payload.cv_id) {
      const isOwnerCV = await this.isOwnerCV(userId, payload.cv_id)
      if (!isOwnerCV) {
        throw new ErrorWithStatus({
          message: 'You are not is owner of this cv',
          status: 401
        })
      }
      temp = { ...temp, cv_id: new ObjectId(payload.cv_id) }
    }
    if (payload.application_date) {
      temp = { ...temp, application_date: new Date(payload.application_date) }
    }

    if (payload.job_post_id) {
      temp = { ...temp, job_post_id: new ObjectId(payload.job_post_id) }
    }
    const _payload = { ...omit(payload, ['cv_id', 'application_date', 'job_post_id']), ...temp } as JobApplicationType
    if (_payload.type === ApplyType.CVOnline) {
      delete _payload.cv_link
    }

    const result = await databaseServices.jobApplication.insertOne(
      new JobApplication({
        ..._payload,
        user_id: new ObjectId(userId),
        status: JobApplicationStatus.Pending
      })
    )

    const job = await databaseServices.job.findOne({
      _id: _payload.job_post_id
    })
    if (job)
      await databaseServices.conversationRooms.insertOne(
        new ConversationRoom({
          company_id: job.company_id,
          user_id: new ObjectId(userId)
        })
      )

    return {
      message: 'apply job'
    }
  }

  static async isOwnerCV(userId: string, cvId: string) {
    const result = await databaseServices.resume.findOne({
      _id: new ObjectId(cvId),
      user_id: new ObjectId(userId)
    })

    return result ? true : false
  }

  static async getAllByPost(postId: string) {
    // const company = await databaseServices.company.findOne({
    //   'users.user_id': new ObjectId(userId)
    // })

    // if (!company) {
    //   throw new ErrorWithStatus({
    //     message: 'Could not find company',
    //     status: 404
    //   })
    // }

    const result = await databaseServices.jobApplication
      .find({
        job_post_id: new ObjectId(postId)
      })
      .toArray()

    return result
  }

  static async getFromCandidate(userId: string) {
    const result = await databaseServices.jobApplication
      .find({
        user_id: new ObjectId(userId)
      })
      .project({
        profile_status: 0,
        status: 0,
        deleted_at: 0
      })
      .toArray()

    return result
  }

  static async getById(jobApplicationId: string) {
    const result = await databaseServices.jobApplication.findOne({
      _id: new ObjectId(jobApplicationId)
    })

    return result
  }

  static async approve(jobApplicationId: string) {
    const result = await databaseServices.jobApplication.findOneAndUpdate(
      {
        _id: new ObjectId(jobApplicationId)
      },
      {
        $set: {
          status: JobApplicationStatus.Approved
        }
      }
    )

    return {
      message: result.ok ? 'Action Approve OK' : 'Action Approve Failed'
    }
  }

  static async reject(jobApplicationId: string) {
    const result = await databaseServices.jobApplication.findOneAndUpdate(
      {
        _id: new ObjectId(jobApplicationId)
      },
      {
        $set: {
          status: JobApplicationStatus.Rejected
        }
      }
    )

    return {
      message: result.ok ? 'Action Reject OK' : 'Action Reject Failed'
    }
  }

  static async updateStatus(jobApplicationId: string, status: JobApplicationStatus) {
    const result = await databaseServices.jobApplication.findOneAndUpdate(
      {
        _id: new ObjectId(jobApplicationId)
      },
      {
        $set: {
          status: status
        }
      }
    )

    return {
      message: result.ok ? `Update status: '${status}' OK` : `Update status: '${status}'Failed`
    }
  }

  static async getJobAppications(filter: searchJobApplication) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const opts = JobApplicationService.convertToOptions(filter) || {}

    console.log(opts)

    const [jas, total] = await Promise.all([
      databaseServices.jobApplication
        .aggregate([
          {
            $match: {
              ...opts
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
      databaseServices.jobApplication
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      message: 'Job application',
      result: {
        jas,
        limit,
        page,
        total: total[0]?.total || 0
      }
    }
  }

  static convertToOptions(filter: searchJobApplication) {
    const options: {
      [key: string]: any
    } = {}
    const content = filter.content?.trim() || ''
    if (content) {
      options['$text'] = {
        $search: content
      }
    }

    if (filter.status && isNumber(Number(filter.status))) {
      options['status'] = Number(filter.status)
    }

    if (filter.profile_status) {
      options['profile_status'] = filter.profile_status
    }

    if (filter.from_date) {
      options['created_at'] = {
        $gte: new Date(filter.from_date)
      }
    }

    if (filter.to_date) {
      if (filter.from_date) {
        options['created_at'] = {
          $gte: new Date(filter.from_date),
          $lte: new Date(filter.to_date)
        }
      } else {
        options['created_at'] = {
          $lte: new Date(filter.to_date)
        }
      }
    }

    if (filter.post_id && ObjectId.isValid(filter.post_id)) {
      options['job_post_id'] = new ObjectId(filter.post_id)
    }

    return options
  }
}

export default JobApplicationService
