import { ObjectId } from 'mongodb'

interface TrackedCandidateType {
  _id?: ObjectId
  company_id: ObjectId
  candidate_id: ObjectId
}

export default class TrackedCandidate {
  _id?: ObjectId
  candidate_id: ObjectId
  company_id: ObjectId
  constructor(data: TrackedCandidateType) {
    this._id = data._id
    this.candidate_id = data.candidate_id
    this.company_id = data.company_id
  }
}
