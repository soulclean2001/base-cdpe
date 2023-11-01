import { ObjectId } from 'mongodb'

export interface CreateCandidateReqBody {
  industry: string[]
  work_location: string[]
  experience: number
  cv_public: boolean
  education_level: string
  level: string
}

export interface UpdateCandidateReqBody {
  industry?: string[]
  work_location?: string[]
  experience?: number
  education_level?: string
  cv_public?: boolean
  level?: string
}
