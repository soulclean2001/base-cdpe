import { ObjectId } from 'mongodb'

export interface CreateCandidateReqBody {
  industry: string
  work_location: string
  experience: string
  cv_public: boolean
  cv_id: string
}

export interface UpdateCandidateReqBody {
  industry?: string
  work_location?: string
  experience?: string
  cv_public?: boolean
  cv_id?: string
}
