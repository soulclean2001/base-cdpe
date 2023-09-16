import { ObjectId } from 'mongodb'

export interface CandidateType {
  _id?: ObjectId
  industry: string
  work_location: string
  experience: string
  cv_public?: boolean
  cv_id: ObjectId
  user_id: ObjectId
}

export default class Candidate {
  _id?: ObjectId
  industry: string
  work_location: string
  experience: string
  cv_public: boolean
  cv_id: ObjectId
  user_id: ObjectId
  constructor(data: CandidateType) {
    this._id = data._id
    this.industry = data.industry
    this.work_location = data.work_location
    this.cv_public = data.cv_public || false
    this.cv_id = data.cv_id
    this.user_id = data.user_id
    this.experience = data.experience
  }
}
