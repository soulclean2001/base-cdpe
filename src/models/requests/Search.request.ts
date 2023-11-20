export interface SearchCandidateReqParam extends Pagination {
  name?: string
  job?: string
  level?: string
  industry?: string[]
  working_location?: string[]
  exp_year_from?: number
  exp_year_to?: number
  foreign_language?: string
  foreign_language_level?: string
  education_level?: string
}

export interface Pagination {
  limit: string
  page: string
}

export interface SearchJobReqParam extends Pagination {
  content?: string
  working_location?: string
  job_level?: string
  job_type?: string
  salary?: {
    min?: number
    max?: number
  }
  industry?: string
  career?: string
  sort_by_salary?: string
  sort_by_post_date?: string
}

export interface SearchCompanyParam extends Pagination {
  content?: string
  field?: string
}
