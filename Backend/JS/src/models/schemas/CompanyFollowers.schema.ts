import { ObjectId } from 'mongodb'

interface CompanyFollowersType {
  _id?: ObjectId
  user_id: ObjectId
  company_id: ObjectId
}

export default class CompanyFollowers {
  _id?: ObjectId
  user_id: ObjectId
  company_id: ObjectId
  constructor(data: CompanyFollowersType) {
    this._id = data._id
    this.user_id = data.user_id
    this.company_id = data.company_id
  }
}
