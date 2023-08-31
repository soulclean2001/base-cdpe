import { ObjectId } from 'mongodb'

export interface PropertyName {
  property_name: string
}

export interface UserInfo {
  wanted_job_title: string
  avatar: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  city: string
  address?: string
  postal_code?: string
  driving_license?: string
  nationality?: string
  place_of_birth?: string
  date_of_birth?: string
}

export interface ProfessionalSummary {
  content: string
}

export interface PropertyResumeOther {
  [key: string]: string | Date
}

export interface Course {
  title: string
  institution: string
  start_date: string
  end_date: string
}

interface BasePropertyResume {
  city: string
  start_date: string
  end_date: string
  description: string
}

export interface CustomePropertyResume extends BasePropertyResume {
  title: string
}

export interface EmploymentHistory extends BasePropertyResume {
  job_title: string
  employer: string
}

export interface Internship extends BasePropertyResume {
  job_title: string
  employer: string
}

export interface ExtraCurricularActivity extends BasePropertyResume {
  function_title: string
  employer: string
}
export interface Education extends BasePropertyResume {
  school: string
  degree: string
}

export interface SocialOrWebsite {
  label: string
  link: string
}

export enum SkillLevel {
  Novice = 'Novice',
  Beginner = 'Beginner',
  Skillful = 'Skillful',
  Experienced = 'Experienced',
  Expert = 'Expert'
}

export interface Skill {
  skill_name: string
  level: string
}

export interface Hobbies {
  description: string
  property_name: string
}

export interface Reference {
  name: string
  company: string
  phone: string
  email: string
}

export interface Show {
  isShow: boolean
}

export enum LanguageLevel {
  NativeSpeaker = 'Native speaker',
  HighlyProficient = 'Highly Proficient',
  VeryGoodCommand = 'Very Good command',
  GoodWorkingKnowledge = 'Good working knowledge',
  WorkingKnowledge = 'Working knowledge',
  C2 = 'C2',
  C1 = 'C1',
  B2 = 'B2',
  B1 = 'B1',
  A2 = 'A2',
  A1 = 'A1'
}

export interface Language {
  language: string
  level: string
}

export interface ResumeType {
  _id?: ObjectId
  user_id: ObjectId
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
}

enum StatusResume {
  Active = 'active',
  Draft = 'draft'
}

export default class Resume {
  _id?: ObjectId
  user_id: ObjectId
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
  constructor(data: ResumeType) {
    this._id = data._id
    this.user_id = data.user_id
    this.user_info = data.user_info
    this.professional_summary = data.professional_summary
    this.employment_histories = data.employment_histories
    this.educations = data.educations
    this.social_or_website = data.social_or_website
    this.skills = data.skills
    this.hobbies = data.hobbies
    this.references = data.references
    this.languages = data.languages
    this.internships = data.internships
    this.courses = data.courses
    this.extra_curricular_activities = data.extra_curricular_activities
    this.additional_info = data.additional_info
    this.status = data.status || StatusResume.Draft
  }
}
