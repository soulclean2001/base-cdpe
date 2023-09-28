import { isStringNotEmpty } from './common.middlewares'
import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

// export interface SearchCandidateReqBody extends Pagination {
//   name?: string
//   job?: string
//   level?: string
//   industry?: string[]
//   working_location?: string[]
//   exp_year_from?: number
//   exp_year_to?: number
//   foreign_language?: string
//   foreign_language_level?: string
//   education_level?: string
// }

// export interface Pagination {
//   limit: string
//   page: string
// }

export const searchCandidateMiddleware = validate(
  checkSchema(
    {
      name: {
        isString: {
          errorMessage: 'name must be a string'
        },
        optional: true
      },
      exp_year_from: {
        custom: {
          options: (value: any) => {
            if (isNaN(value)) throw new Error('exp_year_from must be a number')

            return true
          }
        },
        optional: true
      },
      exp_year_to: {
        custom: {
          options: (value: any) => {
            if (isNaN(value)) throw new Error('exp_year_to must be a number')

            return true
          }
        },
        optional: true
      },
      job: {
        isString: {
          errorMessage: 'job must be a string'
        },
        optional: true
      },
      level: {
        isString: {
          errorMessage: 'level must be a string'
        },
        optional: true
      },
      foreign_language: {
        isString: {
          errorMessage: 'foreign_language must be a string'
        },
        optional: true
      },
      foreign_language_level: {
        isString: {
          errorMessage: 'foreign_language_level must be a string'
        },
        optional: true
      },
      education_level: {
        isString: {
          errorMessage: 'education_level must be a string'
        },
        optional: true
      },
      industry: {
        custom: {
          options: (value: any) => {
            if (!Array.isArray(value)) {
              throw new Error('industry must be an array')
            }
            // Kiểm tra tất cả các phần tử trong mảng có phải là chuỗi không
            if (!value.every((item) => typeof item === 'string')) {
              throw new Error('Each item in industry must be a string')
            }
            return true
          }
        },
        optional: true
      },
      working_location: {
        custom: {
          options: (value: any) => {
            if (!Array.isArray(value)) {
              throw new Error('working_location must be an array')
            }
            // Kiểm tra tất cả các phần tử trong mảng có phải là chuỗi không
            if (!value.every((item) => typeof item === 'string')) {
              throw new Error('Each item in working_location must be a string')
            }
            return true
          }
        },
        optional: true
      },
      limit: {
        custom: {
          options: (value: any) => {
            if (isNaN(value)) throw new Error('limit must be a number')

            if (value < 1) throw new Error('limit not valid')
            return true
          }
        },
        optional: true
      },
      page: {
        custom: {
          options: (value: any) => {
            if (isNaN(value)) throw new Error('page must be a number')
            if (value < 1) throw new Error('page not valid')
            return true
          }
        },
        optional: true
      }
    },
    ['query']
  )
)
