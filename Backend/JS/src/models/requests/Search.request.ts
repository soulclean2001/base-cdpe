export interface SearchCandidateReqBody extends Pagination {
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
