export interface CreatePackageReqBody {
  type: string
  price: number
  title: string
  description: string
  includes: string
  code?: string
  discount_price?: number
  number_of_days_to_expire: number
}

export interface UpdatePackageReqBody {
  type?: string
  price?: number
  title?: string
  description?: string
  includes?: string
  code?: string
  discount_price?: number
  preview?: string
  number_of_days_to_expire?: number
}
