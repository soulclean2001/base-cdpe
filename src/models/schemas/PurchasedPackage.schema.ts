import { ObjectId } from 'mongodb'
import { PackageType } from './Package.schema'

interface PurchasedPackageType {
  _id?: ObjectId
  user_id: ObjectId
  package: PackageType
  expired: Date
  created_at?: Date
  updated_at?: Date
}

class PurchasedPackage {
  _id?: ObjectId
  package: PackageType
  expired: Date
  created_at: Date
  updated_at: Date

  user_id: ObjectId

  constructor(data: PurchasedPackageType) {
    this._id = data._id
    this.package = data.package
    this.expired = data.expired
    this.created_at = data.created_at || new Date()
    this.updated_at = data.updated_at || new Date()
    this.user_id = data.user_id
  }
}

export default PurchasedPackage
