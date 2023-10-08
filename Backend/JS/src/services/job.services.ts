import { CreateJobBody, JobStatus, UpdateJobReqBody } from '~/models/requests/Job.request'
import databaseServices from './database.services'
import Job, { JobType } from '~/models/schemas/Job.schema'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { isNumber } from 'lodash'

export interface JobSearchOptions {
  visibility?: boolean
  status?: JobStatus
  expired_before_nday?: number
}

export default class JobService {
  static convertOptions(options: JobSearchOptions) {
    const opts: { [key: string]: any } = {}

    if (options.expired_before_nday && isNumber(options.expired_before_nday)) {
      const nday = options.expired_before_nday
      const now = new Date()
      const afterNDays = new Date(now.getTime() + nday * 24 * 60 * 60 * 1000)
      opts['expired_date'] = {
        $gte: now,
        $lte: afterNDays
      }
    }

    if (options.status) {
      opts['status'] = options.status
    }

    if (options.visibility) {
      opts['visibility'] = options.visibility
    }

    return opts
  }

  static async createJob({ userId, payload }: { userId: string; payload: CreateJobBody }) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })
    if (!company) {
      throw new ErrorWithStatus({
        message: 'User are not recruiter',
        status: 403
      })
    }

    const _payload = (
      payload.expired_date
        ? { ...payload, expires: new Date(payload.expired_date), status: JobStatus.Pending }
        : { ...payload, status: JobStatus.Unapproved }
    ) as JobType

    const result = await databaseServices.job.insertOne(
      new Job({
        ..._payload,
        user_id: new ObjectId(userId),
        company_id: company._id,
        visibility: false
      })
    )

    return {
      message: 'Job created'
    }
  }

  static async deleteJob({ userId, jobId }: { userId: string; jobId: string }) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })
    if (!company) {
      throw new ErrorWithStatus({
        message: 'User are not recruiter',
        status: 403
      })
    }

    const result = await databaseServices.job.findOneAndDelete({
      _id: new ObjectId(jobId),
      company_id: company._id
    })

    if (!result) {
      throw new ErrorWithStatus({
        message: 'User are not owner of this job',
        status: 401
      })
    }

    return {
      message: 'Deleted job successfully'
    }
  }

  static async updateJob({ userId, jobId, payload }: { userId: string; jobId: string; payload: UpdateJobReqBody }) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })
    if (!company) {
      throw new ErrorWithStatus({
        message: 'User are not recruiter',
        status: 403
      })
    }

    const _payload = (
      payload.expired_date
        ? { ...payload, expires: new Date(payload.expired_date), status: JobStatus.Unapproved }
        : { ...payload, status: JobStatus.Unapproved }
    ) as JobType

    const result = await databaseServices.job.findOneAndUpdate(
      {
        _id: new ObjectId(jobId),
        company_id: company._id
      },
      {
        $set: {
          ..._payload,
          visibility: false
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'User are not owner of this job',
        status: 401
      })
    }

    return {
      message: 'Update job successfully'
    }
  }

  static async getJob(jobId: string) {
    const result = await databaseServices.job.findOne({
      _id: new ObjectId(jobId)
    })
    if (!result) {
      throw new ErrorWithStatus({ message: 'Job not found', status: 404 })
    }
    return result
  }

  static async getAllJob() {
    const result = await databaseServices.job.find({}).toArray()
    return result
  }

  static async getAllJobByCompany(userId: string, limit: number = 2, page: number = 1) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Company not found',
        status: 404
      })
    }
    const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000 // 7 ngày trong mili giây
    const currentDateTime = new Date()
    const [listJob, total] = await Promise.all([
      databaseServices.job
        .aggregate([
          {
            $match: {
              company_id: new ObjectId('65167bf5e569685ca8a7f3ba')
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_post'
            }
          },
          {
            $lookup: {
              from: 'job_applications',
              localField: '_id',
              foreignField: 'post_id',
              as: 'job_applications'
            }
          },
          {
            $unwind: {
              path: '$user_post'
            }
          },
          {
            $addFields: {
              id: '$_id',
              'user.name': '$user_post.name',
              'user.email': '$user_post.email',
              total_applied: {
                $size: '$job_applications'
              },
              salary: {
                $concat: [
                  {
                    $toString: '$salary_range.min'
                  },
                  ' - ',
                  {
                    $toString: '$salary_range.max'
                  }
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              company_id: 0,
              user_post: 0
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

      databaseServices.job
        .aggregate([
          {
            $match: {
              company_id: company._id
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_post'
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      data: listJob,
      total: total[0]?.total || 0,
      limit,
      page: page
    }
  }

  static async getJobByCompany(userId: string, limit: number = 2, page: number = 1, options?: JobSearchOptions) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Company not found',
        status: 404
      })
    }

    const opts = options ? JobService.convertOptions(options) : {}

    const [listJob, total] = await Promise.all([
      databaseServices.job
        .aggregate([
          {
            $match: {
              company_id: company._id,
              ...opts
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_post'
            }
          },
          {
            $lookup: {
              from: 'job_applications',
              localField: '_id',
              foreignField: 'post_id',
              as: 'job_applications'
            }
          },
          {
            $unwind: {
              path: '$user_post'
            }
          },
          {
            $addFields: {
              id: '$_id',
              'user.name': '$user_post.name',
              'user.email': '$user_post.email',
              total_applied: {
                $size: '$job_applications'
              },
              salary: {
                $concat: [
                  {
                    $toString: '$salary_range.min'
                  },
                  ' - ',
                  {
                    $toString: '$salary_range.max'
                  }
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              company_id: 0,
              user_post: 0
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

      databaseServices.job
        .aggregate([
          {
            $match: {
              company_id: company._id,
              ...opts
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user_post'
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      data: listJob,
      total: total[0]?.total || 0,
      limit,
      page: page
    }
  }

  static async approveJob(jobId: string) {
    const result = await databaseServices.job.findOneAndUpdate(
      {
        _id: new ObjectId(jobId)
      },
      {
        $set: {
          status: JobStatus.Approved
        },
        $currentDate: {
          posted_date: true,
          updated_at: true
        }
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Not found this job',
        status: 404
      })
    }

    return {
      message: 'Approved'
    }
  }

  static async rejectJob(jobId: string) {
    const result = await databaseServices.job.findOneAndUpdate(
      {
        _id: new ObjectId(jobId)
      },
      {
        $set: {
          status: JobStatus.Rejected
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'Not found this job',
        status: 404
      })
    }

    return {
      message: 'Rejected'
    }
  }

  static async publish({ userId, jobId, expiredDate }: { userId: string; jobId: string; expiredDate?: string }) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })
    if (!company) {
      throw new ErrorWithStatus({
        message: 'User are not recruiter',
        status: 403
      })
    }

    const oldJob = await databaseServices.job.findOne({
      _id: new ObjectId(jobId),
      company_id: company._id
    })

    if (!oldJob?.expired_date && !expiredDate) {
      throw new ErrorWithStatus({
        message: 'expired date not valid',
        status: 422
      })
    }
    const status = oldJob?.status === JobStatus.Approved ? JobStatus.Approved : JobStatus.Pending

    const dataUpdate = expiredDate ? { expired_date: new Date(expiredDate) } : { expired_date: oldJob?.expired_date }

    const result = await databaseServices.job.findOneAndUpdate(
      {
        _id: new ObjectId(jobId),
        company_id: company._id
      },
      {
        $set: {
          ...dataUpdate,
          status
        },
        $currentDate: {
          posted_date: true,
          updated_at: true
        }
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'User are not owner of this job',
        status: 401
      })
    }

    return {
      message: 'Published job successfully'
    }
  }

  static async hide({ userId, jobId }: { userId: string; jobId: string }) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })
    if (!company) {
      throw new ErrorWithStatus({
        message: 'User are not recruiter',
        status: 403
      })
    }

    const result = await databaseServices.job.findOneAndUpdate(
      {
        _id: new ObjectId(jobId),
        company_id: company._id
      },
      {
        $set: {
          visibility: false
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: 'User are not owner of this job',
        status: 401
      })
    }
    return {
      message: 'Hide job successfully'
    }
  }
}
