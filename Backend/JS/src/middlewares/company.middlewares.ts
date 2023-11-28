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

export const sendEmailValidator = validate(
  checkSchema(
    {
      from_address: {
        optional: true,
        isEmail: {
          errorMessage: 'Please enter a valid email [from address]'
        }
      },
      to_address: {
        isEmail: {
          errorMessage: 'Please enter a valid email [to address]'
        }
      },
      subject: {
        isString: {
          errorMessage: 'Please enter a valid subject [subject] is string'
        },
        custom: {
          options: (value: string) => {
            if (value.length < 25 || value.length > 50) {
              throw new Error(
                'Please enter a valid [subject] must be at least 25 characters long and  <= 50 characters long'
              )
            }

            return true
          }
        }
      },
      data: {
        notEmpty: {
          errorMessage: 'Please not empty the data field'
        },
        custom: {
          options: (value: string) => {
            if (value.length < 100) {
              throw new Error('Please enter a valid data must be at least 100 characters long ')
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
