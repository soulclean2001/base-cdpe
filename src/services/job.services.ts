import { CreateJobBody, JobStatus, UpdateJobReqBody } from '~/models/requests/Job.request'
import databaseServices from './database.services'
import Job, { JobType } from '~/models/schemas/Job.schema'
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
