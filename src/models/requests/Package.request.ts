export interface CreatePackageReqBody {
  type: string
  price: number
  title: string
  description: string
  includes: string
  code?: string
  discount_price?: number
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
}
