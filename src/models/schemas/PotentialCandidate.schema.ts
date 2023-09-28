import { ObjectId } from 'mongodb'

interface PotentialCandidateType {
  _id?: ObjectId
  job_application_id: ObjectId
  company_id: ObjectId
  post_id: ObjectId
}

export default class PotentialCandidate {
  _id?: ObjectId
  job_application_id: ObjectId
  company_id: ObjectId
  post_id: ObjectId

  constructor(data: PotentialCandidateType) {
    this._id = data._id
    this.job_application_id = data.job_application_id
    this.company_id = data.company_id
    this.post_id = data.post_id
  }
}
