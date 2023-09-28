import { Benefit, SalararyRange, WorkingLocation } from '../schemas/Job.schema'

export interface CreateJobBody {
  job_title: string
  alias: string
  is_salary_visible: boolean
  pretty_salary: string
  working_locations: WorkingLocation[]
  industries: [string]
  skills: [string]
  expired_date?: string
  job_level: string
  salary_range: SalararyRange
  job_description: string
  job_requirement: string
  visibility: boolean
  benefits: Benefit[]
  job_type: string
  number_of_employees_needed: number
  application_email: string
}

export interface PublishJobBody {
  expired_date?: string
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
  expired_date?: string

  benefits?: Benefit[]
  job_type?: string
  number_of_employees_needed?: number
  application_email?: string
}
