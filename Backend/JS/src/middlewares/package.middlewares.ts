import { ParamSchema, checkSchema } from 'express-validator'
import { PackageStatus } from '~/models/schemas/Package.schema'
import { validate } from '~/utils/validation'

// price: number
//   title: string
//   description: string
//   includes: string
//   code: string
//   discount_price?: number
//   preview?: string
//   status?: PackageStatus

const priceSchema = (fieldName: string): ParamSchema => {
  return {
    isNumeric: {
      errorMessage: `${fieldName} must be a number`
    }
  }
}

const isStringNotEmpty = (fieldName: string): ParamSchema => {
  return {
    isString: {
      errorMessage: `Please provide a string value for the ${fieldName} parameter`
    },
    notEmpty: {
      errorMessage: `${fieldName} must be not empty`
    }
  }
}

export const createPackageValidator = validate(
  checkSchema(
    {
      type: isStringNotEmpty('type'),
      title: isStringNotEmpty('type'),
      price: priceSchema('price'),
      description: isStringNotEmpty('type'),
      includes: isStringNotEmpty('type'),
      code: {
        ...isStringNotEmpty('type'),
        optional: true
      },
      discount_price: {
        ...priceSchema('price'),
        optional: true
      },
      number_of_days_to_expire: {
        isNumeric: {
          errorMessage: 'Number of days to expire must be a number'
        }
      }
    },
    ['body']
  )
)

export const updatePackageValidator = validate(
  checkSchema(
    {
      type: {
        ...isStringNotEmpty('type'),
        optional: true
      },
      title: {
        ...isStringNotEmpty('type'),
        optional: true
      },
      price: {
        ...priceSchema('price'),
        optional: true
      },
      description: {
        ...isStringNotEmpty('type'),
        optional: true
      },
      includes: {
        ...isStringNotEmpty('type'),
        optional: true
      },
      code: {
        ...isStringNotEmpty('type'),
        optional: true
      },
      discount_price: {
        ...priceSchema('price'),
        optional: true
      },
      number_of_days_to_expire: {
        isNumeric: {
          errorMessage: 'Number of days to expire must be a number'
        },
        optional: true
      }
    },
    ['body']
  )
)

export const packageQueryMiddleware = validate(
  checkSchema(
    {
      limit: {
        isNumeric: {
          errorMessage: 'limit must be a number'
        },
        optional: true
      },
      page: {
        isNumeric: true,
        optional: true
      },
      title: {
        isString: true,
        optional: true
      }
    },
    ['query']
  )
)
