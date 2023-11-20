import { ResumeRequestBody } from '~/models/requests/Resume.request'
import Resume, { ResumeType } from '~/models/schemas/Resume.schema'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { deleteFileFromS3 } from '~/utils/s3'
import NotificationService from './notification.services'
import { NotificationObject } from '~/models/schemas/Notification.schema'

class ResumeService {
  static async createResume(user_id: string, payload: ResumeRequestBody) {
    const result = await databaseServices.resume.insertOne(
      new Resume({
        ...payload,
        user_id: new ObjectId(user_id)
      })
    )
    return result
  }
  static convertToEntity(payload: ResumeRequestBody) {
    const _user_info = payload.user_info!
    const new_user_info = _user_info.date_of_birth
      ? { ..._user_info, date_of_birth: new Date(_user_info.date_of_birth) }
      : _user_info
    const _payload = { ...payload, user_info: new_user_info } as ResumeType
    return _payload
  }
  static async updateResume(user_id: string, resume_id: string, payload: ResumeRequestBody) {
    const oldResume = await databaseServices.resume.findOne({
      _id: new ObjectId(resume_id),
      user_id: new ObjectId(user_id)
    })

    const result = await databaseServices.resume.findOneAndUpdate(
      {
        _id: new ObjectId(resume_id),
        user_id: new ObjectId(user_id)
      },
      {
        $set: {
          ...payload
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!result.value) {
      throw new ErrorWithStatus({
        message: 'not found resume',
        status: 404
      })
    }

    if (oldResume) {
      const oldUrls = []
      if (oldResume.user_info?.avatar && payload['user_info.avatar'] !== undefined) {
        const convertToS3Url = oldResume.user_info.avatar.match(/images\/.*/)
        console.log(convertToS3Url)
        if (convertToS3Url && convertToS3Url.length > 0) oldUrls.push(convertToS3Url[0])
      }
      if (oldUrls.length === 1) await deleteFileFromS3(oldUrls[0])
    }

    const recievers = await this.getListFollowers(resume_id)
    const recievers2 = await this.getListPotentials(resume_id, user_id)

    const candidate = await databaseServices.candidate.findOne({
      user_id: new ObjectId(user_id)
    })

    const jobapplied = await databaseServices.jobApplication.findOne({
      user_id: new ObjectId(user_id),
      cv_id: new ObjectId(resume_id)
    })

    await NotificationService.notify(
      {
        content: `1 ứng viên mà bạn đang theo dõi '${
          oldResume?.user_info?.first_name + ' ' + oldResume?.user_info?.last_name
        }' đã cập nhật lại CV của mình`,
        object_recieve: NotificationObject.Employer,
        object_sent: NotificationObject.Candidate,
        recievers,
        type: 'resume/update',
        sender: new ObjectId(user_id)
      },
      {
        candidate_id: candidate?._id
      }
    )

    await NotificationService.notify(
      {
        content: `1 ứng viên tiềm năng gần đây đã nộp đơn: '${jobapplied?.full_name}' đã cập nhật lại CV của mình`,
        object_recieve: NotificationObject.Employer,
        object_sent: NotificationObject.Candidate,
        recievers: recievers2,
        type: 'potential/update',
        sender: new ObjectId(user_id)
      },
      {
        candidate_id: candidate?._id
      }
    )

    return result.value
  }

  static async getListFollowers(cvId: string) {
    const followers = await databaseServices.candidate
      .aggregate([
        {
          $match: {
            cv_id: new ObjectId(cvId),
            cv_public: true
          }
        },
        {
          $lookup: {
            from: 'tracked_candidates',
            localField: '_id',
            foreignField: 'candidate_id',
            as: 'follower_ids'
          }
        },
        {
          $addFields: {
            follower_ids: '$follower_ids.company_id'
          }
        },
        {
          $project: {
            follower_ids: 1,
            _id: 0
          }
        },
        {
          $unwind: {
            path: '$follower_ids',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: 'follower_ids',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            users: '$company.users'
          }
        },
        {
          $project: {
            users: 1
          }
        }
      ])
      .toArray()

    const userIds: string[] = []
    for (let i = 0; i < followers.length; i++) {
      for (let j = 0; j < followers[i].users.length; j++) {
        userIds.push(followers[i].users[j].user_id.toString())
      }
    }

    return userIds
  }

  static async getListPotentials(cvId: string, userId: string) {
    const potentials = await databaseServices.jobApplication
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(userId),
            status: 3,
            cv_id: new ObjectId(cvId)
          }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'job_post_id',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: {
            path: '$job',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: 'job.company_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$company._id'
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: '_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            users: '$company.users'
          }
        },
        {
          $project: {
            users: 1
          }
        }
      ])
      .toArray()

    const userIds: string[] = []
    for (let i = 0; i < potentials.length; i++) {
      for (let j = 0; j < potentials[i].users.length; j++) {
        userIds.push(potentials[i].users[j].user_id.toString())
      }
    }

    return userIds
  }

  static async updateOrCreateResume(user_id: string, payload: ResumeRequestBody) {
    const oldResume = await databaseServices.resume.findOne({
      user_id: new ObjectId(user_id)
    })

    const result = await databaseServices.resume.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id)
      },
      {
        $set: {
          ...payload
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    if (!result.value) {
      throw new ErrorWithStatus({
        message: 'not found resume',
        status: 404
      })
    }

    if (oldResume) {
      const oldUrls = []
      if (oldResume.user_info?.avatar && payload['user_info.avatar'] !== undefined) {
        const convertToS3Url = oldResume.user_info.avatar.match(/images\/.*/)
        console.log(convertToS3Url)
        if (convertToS3Url && convertToS3Url.length > 0) oldUrls.push(convertToS3Url[0])
      }
      if (oldUrls.length === 1) await deleteFileFromS3(oldUrls[0])
    }

    const recievers = await this.getListFollowers(result.value._id.toString())
    const recievers2 = await this.getListPotentials(result.value._id.toString(), user_id)

    const candidate = await databaseServices.candidate.findOne({
      user_id: new ObjectId(user_id)
    })

    const jobapplied = await databaseServices.jobApplication.findOne({
      user_id: new ObjectId(user_id),
      cv_id: new ObjectId(result.value._id.toString())
    })

    await NotificationService.notify(
      {
        content: `1 ứng viên mà bạn đang theo dõi '${
          oldResume?.user_info?.first_name + ' ' + oldResume?.user_info?.last_name
        }' đã cập nhật lại CV của mình`,
        object_recieve: NotificationObject.Employer,
        object_sent: NotificationObject.Candidate,
        recievers,
        type: 'resume/update',
        sender: new ObjectId(user_id)
      },
      {
        candidate_id: candidate?._id
      }
    )

    await NotificationService.notify(
      {
        content: `${jobapplied?.full_name}`,
        object_recieve: NotificationObject.Employer,
        object_sent: NotificationObject.Candidate,
        recievers: recievers2,
        type: 'potential/update',
        sender: new ObjectId(user_id)
      },
      {
        job_applied_id: jobapplied?._id
      }
    )

    return result.value
  }

  static async deleteResume(user_id: string, resume_id: string) {
    const result = await databaseServices.resume.findOne({
      _id: new ObjectId(resume_id),
      user_id: new ObjectId(user_id)
    })
    const oldUrls = []
    if (result && result.user_info && result.user_info.avatar) {
      const convertToS3Url = result.user_info.avatar.match(/images\/.*/)
      if (convertToS3Url && convertToS3Url.length > 0) oldUrls.push(convertToS3Url[0])
    }
    if (oldUrls.length === 1) await deleteFileFromS3(oldUrls[0])

    const deleted = await databaseServices.resume.deleteOne({
      _id: new ObjectId(resume_id),
      user_id: new ObjectId(user_id)
    })
    return deleted
  }

  static async getResumeByMe(user_id: string, resume_id: string) {
    const result = await databaseServices.resume.findOne({
      _id: new ObjectId(resume_id),
      user_id: new ObjectId(user_id)
    })
    return result
  }

  static async getAllResumesByMe(user_id: string) {
    const result = await databaseServices.resume
      .find({
        user_id: new ObjectId(user_id)
      })
      .toArray()
    return result
  }

  static async getAllResumes() {
    const result = await databaseServices.resume.find({}).toArray()
    return result
  }
}

export default ResumeService
