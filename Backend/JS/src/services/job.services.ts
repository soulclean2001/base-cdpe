import { CreateJobBody, JobStatus, UpdateJobReqBody } from '~/models/requests/Job.request'
import databaseServices from './database.services'
import Job from '~/models/schemas/Job.schema'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
export default class JobService {
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

    const result = await databaseServices.job.insertOne(
      new Job({
        ...payload,
        user_id: new ObjectId(userId),
        company_id: company._id,
        visibility: false,
        status: JobStatus.Unapproved
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

    const result = await databaseServices.job.findOneAndUpdate(
      {
        _id: new ObjectId(jobId),
        company_id: company._id
      },
      {
        $set: {
          ...payload,
          visibility: false,
          status: JobStatus.Unapproved
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

  static async getAllJobByCompany(userId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Company not found',
        status: 404
      })
    }

    const listJob = await databaseServices.job
      .find({
        company_id: company._id
      })
      .toArray()

    return listJob
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

  static async publish({ userId, jobId, expiredDate }: { userId: string; jobId: string; expiredDate: string }) {
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
          expired_date: new Date(expiredDate),
          visibility: true,
          status: JobStatus.Pending
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
