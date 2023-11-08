import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { workingLocationsSchema } from './job.middlewares'
import { isArray } from 'lodash'

export const updateCompanyValidator = validate(
  checkSchema(
    {
      company_name: {
        optional: true,
        notEmpty: {
          errorMessage: 'Company name must be not empty'
        },
        isString: {
          errorMessage: 'Company name must be a string'
        }
      },

      company_info: {
        optional: true,
        isString: {
          errorMessage: 'Company info must be a string'
        }
      },

      fields: {
        optional: true,
        custom: {
          options: async (value: any, { req }) => {
            if (!isArray(value)) throw new Error('fields must be an array')

            for (const v of value) {
              if (!v) {
                throw new Error('each value of fields is not empty')
              } else if (typeof v !== 'string') {
                throw new Error('each value of fields must be string')
              }
            }
            return true
          }
        }
      },

      pictures: {
        optional: true,
        custom: {
          options: async (value: any, { req }) => {
            if (!isArray(value)) throw new Error('pictures must be an array')

            for (const v of value) {
              if (!v) {
                throw new Error('each value of pictures is not empty')
              } else if (typeof v !== 'string') {
                throw new Error('each value of pictures must be string')
              }
            }
            return true
          }
        }
      },
      videos: {
        optional: true,
        custom: {
          options: async (value: any, { req }) => {
            if (!isArray(value)) throw new Error('videos must be an array')

            for (const v of value) {
              if (!v) {
                throw new Error('each value of videos is not empty')
              } else if (typeof v !== 'string') {
                throw new Error('each value of videos must be string')
              }
            }
            return true
          }
        }
      },

      company_size: {
        optional: true,
        notEmpty: {
          errorMessage: 'Company size must be not empty'
        },
        isString: {
          errorMessage: 'Company size must be a string'
        }
      },
      working_locations: {
        ...workingLocationsSchema,
        optional: true
      }
    },
    ['body']
  )
)
