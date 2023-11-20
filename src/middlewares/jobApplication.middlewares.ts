import { ParamSchema, checkSchema } from 'express-validator'
import { isISO8601, isStringNotEmpty } from './common.middlewares'
import { validate } from '~/utils/validation'
import { ObjectId } from 'mongodb'
import { ApplyType, JobApplicationStatus, ProfileStatus } from '~/models/schemas/JobApplication.schema'
import { USERS_MESSAGES } from '~/constants/messages'

// job_post_id: string
// application_date: string
// cv_link: string
// cv_id: string
// full_name: string
// phone_number?: string
// email: string
// type: ApplyType

export const applyJobValidator = validate(
  checkSchema(
    {
      job_post_id: {
        custom: {
          options: (value: any) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid job_post_id: ' + value)
            }
            return true
          }
        }
      },
      application_date: {
        ...isISO8601('application_date'),
        optional: true
      },
      cv_link: {
        custom: {
          options: (value: any, { req }) => {
            if (req.body.type === ApplyType.FileUpload) {
              if (!value) {
                throw new Error('cv_link is not empty')
              }
            }
            return true
          }
        }
      },
      full_name: {
        ...isStringNotEmpty('full_name')
      },
      phone_number: {
        optional: true,
        notEmpty: true,
        isString: true,
        custom: {
          options: async (value: string, { req }) => {
            const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
            if (!regexPhoneNumber.test(value)) {
              throw new Error(USERS_MESSAGES.PHONE_NUMBER_INVALID)
            }
            return true
          }
        }
      },
      email: {
        isEmail: true,
        notEmpty: true
      },
      type: {
        isNumeric: true,
        custom: {
          options: (value: any) => {
            if (!Object.keys(ApplyType).includes(String(value))) {
              throw new Error(`type is must be 0 or 1 (CVOnline, File)`)
            }
            return true
          }
        }
      },
      cv_id: {
        custom: {
          options: (value: any, { req }) => {
            if (req.body.type === ApplyType.CVOnline) {
              if (!value) {
                throw new Error('cv_id is not empty')
              }

              if (!ObjectId.isValid(value)) {
                throw new Error('Invalid cv id: ' + value)
              }
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const idValidator = (fieldId: string) =>
  validate(
    checkSchema(
      {
        [fieldId]: {
          custom: {
            options: (value: any) => {
              if (!ObjectId.isValid(value)) {
                throw new Error(`invalid ${fieldId}`)
              }
              return true
            }
          }
        }
      },
      ['params']
    )
  )

export const updateStatusValidator = validate(
  checkSchema(
    {
      status: {
        isNumeric: true,
        custom: {
          options: (value: any) => {
            if (!Object.keys(JobApplicationStatus).includes(String(value))) {
              throw new Error('Invalid status: ' + value)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateProfileStatusValidator = validate(
  checkSchema(
    {
      profile_status: {
        isString: true,
        custom: {
          options: (value: any) => {
            if (!Object.values(ProfileStatus).includes(value)) {
              throw new Error(
                'Invalid profile status: ' +
                  value +
                  '. Must be is ' +
                  Object.keys(ProfileStatus).join(', ').toLowerCase()
              )
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const jobApplicationQueryMiddleware = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        optional: true
      },
      page: {
        isNumeric: true,
        optional: true
      },
      status: {
        isNumeric: true,
        optional: true
      },
      profile_status: {
        isString: true,
        optional: true
      },

      content: {
        isString: true,
        optional: true
      },
      from_day: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: 'from_day must be a valid ISO8601'
        },
        optional: true
      },
      to_day: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: 'to_day must be a valid ISO8601'
        },
        optional: true
      },
      post_id: {
        optional: true,
        custom: {
          options: (value: any) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid post_id: ' + value)
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
