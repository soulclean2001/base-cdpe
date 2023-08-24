import { ObjectId } from 'mongodb'

interface GeoLocation {
  lat: number
  lon: number
}

interface WorkingLocationType {
  geo_loc: GeoLocation
  city: object
  address: object
  district: object
  city_name: string
}

interface JobType {
  _id?: ObjectId
  job_title: string
  company_logo: string
  company_id: ObjectId
  alias: string
  is_salary_visible: boolean
  pretty_salary: string
  job_level_id: ObjectId
  expired_date: Date
  user_id: ObjectId
  is_show_logo: boolean
  working_locations: WorkingLocationType
  industries: [any]
  skills: [string]
  job_level: string
  company: string
  posted_date: Date
  salary_range: object
  job_description: string
  job_requirement: string
  locations: []
}
