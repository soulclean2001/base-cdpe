import { ObjectId } from 'mongodb'
import { PackageType } from '../schemas/Package.schema'

export interface PurchasedPackageReqBody {
  _id?: ObjectId
  user_id: ObjectId
  package: PackageType
  expired: Date
  created_at?: Date
  updated_at?: Date
}
