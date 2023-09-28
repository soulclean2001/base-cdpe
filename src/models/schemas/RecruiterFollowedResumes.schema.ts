import { ObjectId } from 'mongodb'

interface RecruiterFollowedResumesType {
  _id?: ObjectId
  recruiter_id: ObjectId
  resume_id: ObjectId
}

export default class RecruiterFollowedResumes {
  _id?: ObjectId
  recruiter_id: ObjectId
  resume_id: ObjectId
  constructor(data: RecruiterFollowedResumesType) {
    this._id = data._id
    this.recruiter_id = data.recruiter_id
    this.resume_id = data.resume_id
  }
}
