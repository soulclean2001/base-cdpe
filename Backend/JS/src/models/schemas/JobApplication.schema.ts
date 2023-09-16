import { ObjectId } from 'mongodb'

export enum JobApplicationStatus {
  Pending,
  Approved,
  Rejected,
  Potential,
  Interview,
  Hired,
  Cancelled,
  NotContactable
}

export enum ApplyType {
  CVOnline,
  FileUpload
}

export interface JobApplicationType {
  _id?: ObjectId
  job_post_id: ObjectId
  user_id: ObjectId
  application_date: Date
  cv_link?: string
  status: JobApplicationStatus
  cv_id?: ObjectId
  full_name?: string
  phone_number?: string
  email?: string
  type: ApplyType
}

export default class JobApplication {
  _id?: ObjectId
  job_post_id: ObjectId
  user_id: ObjectId
  application_date: Date
  cv_link?: string
  status: JobApplicationStatus
  cv_id?: ObjectId
  full_name: string
  phone_number: string
  email: string
  type: ApplyType

  constructor(data: JobApplicationType) {
    this._id = data._id
    this.job_post_id = data.job_post_id
    this.user_id = data.user_id
    this.application_date = data.application_date
    this.status = data.status
    this.cv_id = data.cv_id
    this.cv_link = data.cv_link || ''
    this.full_name = data.full_name || ''
    this.phone_number = data.phone_number || ''
    this.email = data.email || ''
    this.type = data.type || ApplyType.CVOnline
  }
}
