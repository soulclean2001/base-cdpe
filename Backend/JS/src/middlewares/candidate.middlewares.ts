import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { isStringNotEmpty } from './common.middlewares'
import { ObjectId } from 'mongodb'
import { isString } from 'lodash'

export const createCandidateValidator = validate(
  checkSchema(
    {
      industry: {
        custom: {
          options: (value: any) => {
            if (!Array.isArray(value)) {
              throw new Error('industry must be an array string')
            }

            value.forEach((value) => {
              if (!isString(value) || !(value.length > 0)) throw new Error('industry must be an array string')
            })
            return true
          }
        },
        optional: true
      },
      work_location: {
        custom: {
          options: (value: any) => {
            if (!Array.isArray(value)) {
              throw new Error('industry must be an array string')
            }

            value.forEach((value) => {
              if (!isString(value) || !(value.length > 0)) throw new Error('industry must be an array string')
            })
            return true
          }
        },
        optional: true
      },
      experience: {
        isNumeric: true,
        optional: true
      },
      education_level: {
        ...isStringNotEmpty('education_level'),
        optional: true
      },
      level: {
        ...isStringNotEmpty('level'),
        optional: true
      },
      cv_public: {
        isBoolean: {
          errorMessage: 'cv_public is not a boolean'
        },
        optional: true
      }
      // cv_id: {
      //   custom: {
      //     options: (value: any) => {
      //       if (!ObjectId.isValid(value)) {
      //         throw new Error('Invalid cv id: ' + value)
      //       }
      //       return true
      //     }
      //   }
      // }
    },
    ['body']
  )
)

export const updateCandidateValidator = validate(
  checkSchema(
    {
      industry: {
        custom: {
          options: (value: any) => {
            if (!Array.isArray(value)) {
              throw new Error('industry must be an array string')
            }

            value.forEach((value) => {
              if (!isString(value) || !(value.length > 0)) throw new Error('industry must be an array string')
            })
            return true
          }
        },
        optional: true
      },
      work_location: {
        custom: {
          options: (value: any) => {
            if (!Array.isArray(value)) {
              throw new Error('industry must be an array string')
            }

            value.forEach((value) => {
              if (!isString(value) || !(value.length > 0)) throw new Error('industry must be an array string')
            })
            return true
          }
        },
        optional: true
      },
      experience: {
        isNumeric: true,
        optional: true
      },
      education_level: {
        ...isStringNotEmpty('education_level'),
        optional: true
      },
      level: {
        ...isStringNotEmpty('level'),
        optional: true
      },
      cv_public: {
        isBoolean: {
          errorMessage: 'cv_public is not a boolean'
        },
        optional: true
      }
      // cv_id: {
      //   custom: {
      //     options: (value: any) => {
      //       if (!ObjectId.isValid(value)) {
      //         throw new Error('Invalid cv id: ' + value)
      //       }
      //       return true
      //     }
      //   },
      //   optional: true
      // }
    },
    ['body']
  )
)

export const getCandidateValidator = validate(
  checkSchema(
    {
      candidate_id: {
        custom: {
          options: (value: any) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid candidate identifier')
            }

            return true
          }
        }
      }
    },
    ['params']
  )
)
