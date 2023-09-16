import { ObjectId } from 'mongodb'
import {
  Course,
  CustomePropertyResume,
  Education,
  EmploymentHistory,
  ExtraCurricularActivity,
  Hobbies,
  Internship,
  Language,
  ProfessionalSummary,
  PropertyName,
  PropertyResumeOther,
  Reference,
  Show,
  Skill,
  SocialOrWebsite,
  UserInfo
} from '../schemas/Resume.schema'

export enum StatusResume {
  Active = 'active',
  Draft = 'draft'
}

export interface ResumeRequestBody {
  ['user_info.avatar']?: string
  title?: string
  user_info?: UserInfo & PropertyName
  professional_summary?: ProfessionalSummary & PropertyName
  employment_histories?: {
    data: EmploymentHistory[]
  } & PropertyName
  educations?: {
    data: Education[]
  } & PropertyName
  social_or_website?: {
    data: SocialOrWebsite[]
  } & PropertyName
  skills?: {
    data: Skill[]
  } & PropertyName &
    Show
  // not specified
  hobbies?: Hobbies & PropertyName
  references?: {
    data: Reference[]
  } & PropertyName &
    Show
  languages?: {
    data: Language[]
  } & PropertyName
  internships?: {
    data: Internship[]
  } & PropertyName
  courses?: {
    data: Course[]
  } & PropertyName
  extra_curricular_activities?: {
    data: ExtraCurricularActivity[]
  } & PropertyName
  additional_info?: ({
    data: CustomePropertyResume[]
  } & PropertyName)[]
  status?: string
  is_show?: boolean
}
