import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { WorkingLocation } from '~/models/schemas/Job.schema'
import { Schema } from 'yaml'
import databaseServices from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import { PositionType } from '~/models/requests/Company.request'

const isStringNotEmpty = (field: string): ParamSchema => {
  return {
    isString: {
      errorMessage: `${field} must be a string`
    },
    notEmpty: {
      errorMessage: `${field} must not be empty`
    }
  }
}

const workingLocationsSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error('working_locations must be an array')
      }

      for (const location of value) {
        if (typeof location !== 'object' || location === null || Array.isArray(location)) {
          throw new Error('Each element in working_locations must be an object')
        }
        const requiredKeys = ['lat', 'lon', 'address', 'district', 'city_name', 'branch_name']

        for (const key of requiredKeys) {
          if (!(key in location)) {
            throw new Error(`working_locations must contain ${key}`)
          }
        }

        // Kiểm tra kiểu dữ liệu của các thuộc tính
        if (
          typeof location.lat !== 'number' ||
          typeof location.lon !== 'number' ||
          typeof location.branch_name !== 'string' ||
          typeof location.address !== 'string' ||
          typeof location.district !== 'string' ||
          typeof location.city_name !== 'string'
        ) {
          throw new Error('working_locations properties have invalid types')
        }
      }

      // Tiếp tục kiểm tra các điều kiện khác nếu cần

      return true
    }
  }
}

const industriesSchema: ParamSchema = {
  custom: {
    options: (value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error('industries must be an array')
      }

      // Kiểm tra từng phần tử trong mảng
      for (const industry of value) {
        if (typeof industry !== 'string') {
          throw new Error('Each industry must be a string')
        }
      }

      // Tiếp tục kiểm tra các điều kiện khác nếu cần

      return true
    }
  }
}

const skillsSchema: ParamSchema = {
  custom: {
    options: (value, { req }) => {
      if (!Array.isArray(value)) {
        throw new Error('skills must be an array')
      }

      // Kiểm tra từng phần tử trong mảng
      for (const industry of value) {
        if (typeof industry !== 'string') {
          throw new Error('Each skill must be a string')
        }
      }

      // Tiếp tục kiểm tra các điều kiện khác nếu cần

      return true
    }
  }
}

const salaryRangeSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      if (typeof value !== 'object') {
        throw new Error('salary range is not a object')
      }

      const requiredKeys = ['min', 'max']

      for (const key of requiredKeys) {
        if (!(key in value)) {
          throw new Error(`salary range must contain ${key}`)
        }
      }

      // Kiểm tra kiểu dữ liệu của các thuộc tính
      if (typeof value.min !== 'number' || typeof value.max !== 'number') {
        throw new Error('working_locations properties have invalid types')
      }

      // Tiếp tục kiểm tra các điều kiện khác nếu cần

      return true
    }
  }
}

const applicationEmail: ParamSchema = {
  isString: {
    errorMessage: 'email must be a string'
  },
  custom: {
    options: (value: string) => {
      const cleanArrEmail = value.replace(/\s+/g, '').trim()
      const newArrEmail = cleanArrEmail.split(',')

      for (const email of newArrEmail) {
        const isEmail = String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        if (!isEmail) {
          throw new Error('valid email address')
        }
      }
      return true
    }
  }
}

export const createJobValidator = validate(
  checkSchema(
    {
      job_title: isStringNotEmpty('Job title'),
      job_type: isStringNotEmpty('Job type'),
      alias: {
        optional: true,
        isString: {
          errorMessage: 'Company id must be a string'
        }
      },
      is_salary_visible: {
        isBoolean: true
      },
      pretty_salary: {
        ...isStringNotEmpty('pretty_salary'),
        optional: true
      },
      working_locations: {
        ...workingLocationsSchema,
        optional: true
      },
      industries: {
        ...industriesSchema,
        optional: true
      },
      skills: {
        ...skillsSchema,
        optional: true
      },
      job_level: {
        ...isStringNotEmpty('job_level'),
        optional: true
      },
      salary_range: {
        ...salaryRangeSchema,
        optional: true
      },
      job_description: {
        ...isStringNotEmpty('Job description'),
        optional: true
      },
      job_requirement: {
        ...isStringNotEmpty('Job requirement'),
        optional: true
      },
      visibility: {
        isBoolean: true,
        optional: true
      },
      benefits: {
        optional: true,
        custom: {
          options: (values: any) => {
            if (!Array.isArray(values)) {
              throw new Error('Invalid array benefits')
            }
            const expectedFields = ['type', 'value']
            const errors = []
            for (let i = 0; i < values.length; i++) {
              for (const key in values[i]) {
                if (!expectedFields.includes(key)) {
                  errors.push(`${key} not contained in benefits[${i}]`)
                }
                if (expectedFields.includes(key) && typeof values[i][key] !== 'string') {
                  errors.push(`${key} contained in benefits[${i}] must be a string`)
                }
              }
              if (errors.length > 0) {
                throw new Error(errors.toString())
              }
            }
            return true
          }
        }
      },
      application_email: applicationEmail,
      number_of_employees_needed: {
        optional: true,
        isNumeric: true
      }
    },
    ['body']
  )
)

export const publishJobValidator = validate(
  checkSchema(
    {
      expired_date: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: 'expired_date must be a valid ISO8601'
        }
      }
    },
    ['body']
  )
)

export const updateJobValidator = validate(
  checkSchema(
    {
      job_title: {
        ...isStringNotEmpty('Job title'),
        optional: true
      },
      job_type: {
        ...isStringNotEmpty('Job type'),
        optional: true
      },
      alias: {
        optional: true,
        isString: {
          errorMessage: 'Company id must be a string'
        }
      },
      is_salary_visible: {
        isBoolean: true,
        optional: true
      },
      pretty_salary: {
        ...isStringNotEmpty('pretty_salary'),
        optional: true
      },
      working_locations: {
        ...workingLocationsSchema,
        optional: true
      },
      industries: {
        ...industriesSchema,
        optional: true
      },
      skills: {
        ...skillsSchema,
        optional: true
      },
      job_level: {
        ...isStringNotEmpty('job_level'),
        optional: true
      },
      salary_range: {
        ...salaryRangeSchema,
        optional: true
      },
      job_description: {
        ...isStringNotEmpty('Job description'),
        optional: true
      },
      job_requirement: {
        ...isStringNotEmpty('Job requirement'),
        optional: true
      },
      visibility: {
        isBoolean: true,
        optional: true
      },
      application_email: {
        ...applicationEmail,
        optional: true
      },
      number_of_employees_needed: {
        optional: true,
        isNumeric: true
      },
      benefits: {
        optional: true,
        custom: {
          options: (values: any) => {
            if (!Array.isArray(values)) {
              throw new Error('Invalid array benefits')
            }
            const expectedFields = ['type', 'value']
            const errors = []
            for (let i = 0; i < values.length; i++) {
              for (const key in values[i]) {
                if (!expectedFields.includes(key)) {
                  errors.push(`${key} not contained in benefits[${i}]`)
                }
                if (expectedFields.includes(key) && values[i][key] !== 'string') {
                  errors.push(`${key} contained in benefits[${i}] must be a string`)
                }
              }
              if (errors.length > 0) {
                throw new Error(errors.toString())
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
