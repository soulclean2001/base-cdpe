import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { workingLocationsSchema } from './job.middlewares'

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
      province: {
        optional: true,
        notEmpty: {
          errorMessage: 'Province name must be not empty'
        },
        isString: {
          errorMessage: 'Province name must be a string'
        }
      },
      district: {
        optional: true,
        notEmpty: {
          errorMessage: 'District name must be not empty'
        },
        isString: {
          errorMessage: 'District name must be a string'
        }
      },

      company_info: {
        optional: true,
        notEmpty: {
          errorMessage: 'Company info must be not empty'
        },
        isString: {
          errorMessage: 'Company info must be a string'
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
