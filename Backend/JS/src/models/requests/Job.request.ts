import { Benefit, SalararyRange, WorkingLocation } from '../schemas/Job.schema'

export interface CreateJobBody {
  job_title: string
  alias: string
  is_salary_visible: boolean
  pretty_salary: string
  working_locations: WorkingLocation[]
  industries: [string]
  skills: [string]
  job_level: string
  salary_range: SalararyRange
  job_description: string
  job_requirement: string
  visibility: boolean
  benefits: Benefit[]
  job_type: string
}

export interface PublishJobBody {
  expired_date: string
}

export enum JobStatus {
  Approved,
  Pending,
  Rejected,
  Unapproved
}

export interface UpdateJobReqBody {
  job_title?: string
  alias?: string
  is_salary_visible?: boolean
  pretty_salary?: string
  working_locations?: WorkingLocation[]
  industries?: [string]
  skills?: [string]
  job_level?: string
  salary_range?: SalararyRange
  job_description?: string
  job_requirement?: string
  visibility?: boolean
  benefits?: Benefit[]
  job_type?: string
}
