import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { isStringNotEmpty } from './common.middlewares'
import { ObjectId } from 'mongodb'

export const createCandidateValidator = validate(
  checkSchema(
    {
      industry: {
        ...isStringNotEmpty('industry')
      },
      work_location: {
        ...isStringNotEmpty('work_location')
      },
      experience: {
        ...isStringNotEmpty('experience')
      },
      cv_public: {
        isBoolean: {
          errorMessage: 'cv_public is not a boolean'
        }
      },
      cv_id: {
        custom: {
          options: (value: any) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid cv id: ' + value)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateCandidateValidator = validate(
  checkSchema(
    {
      industry: {
        ...isStringNotEmpty('industry'),
        optional: true
      },
      work_location: {
        ...isStringNotEmpty('work_location'),
        optional: true
      },
      experience: {
        ...isStringNotEmpty('experience'),
        optional: true
      },
      cv_public: {
        isBoolean: {
          errorMessage: 'cv_public is not a boolean'
        },
        optional: true
      },
      cv_id: {
        custom: {
          options: (value: any) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid cv id: ' + value)
            }
            return true
          }
        },
        optional: true
      }
    },
    ['body']
  )
)
