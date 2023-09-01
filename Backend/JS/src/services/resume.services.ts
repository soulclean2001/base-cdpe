import { ResumeRequestBody } from '~/models/requests/Resume.request'
import Resume, { ResumeType } from '~/models/schemas/Resume.schema'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'

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
    return result.value
  }

  static async deleteResume(user_id: string, resume_id: string) {
    const result = await databaseServices.resume.findOneAndDelete({
      _id: new ObjectId(resume_id),
      user_id: new ObjectId(user_id)
    })
    return result.ok
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
