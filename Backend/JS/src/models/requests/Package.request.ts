import { PackageType } from '~/constants/enums'

export interface CreatePackageReqBody {
  type: PackageType
  price: number
  title: string
  description: string
  includes: string
  code?: string
  preview?: string[]
  discount_price?: number
  number_of_days_to_expire: number
}

export interface UpdatePackageReqBody {
  price?: number
  title?: string
  description?: string
  includes?: string
  code?: string
  discount_price?: number
  preview?: string[]
  number_of_days_to_expire?: number
}
