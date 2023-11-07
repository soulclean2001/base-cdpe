import { ObjectId } from 'mongodb'
import { ApplyType, JobApplicationStatus } from '../schemas/JobApplication.schema'

export interface ApplyReqBody {
  job_post_id: string
  application_date?: string
  cv_link?: string
  cv_id?: string
  full_name: string
  phone_number?: string
  email: string
  type: ApplyType
}

export interface UpdateStatusJobApplicationBody {
  status: JobApplicationStatus
}
