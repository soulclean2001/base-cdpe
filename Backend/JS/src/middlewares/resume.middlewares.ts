import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import {
  Hobbies,
  Language,
  ProfessionalSummary,
  PropertyName,
  PropertyResumeOther,
  Reference,
  ResumeType,
  Show,
  Skill,
  SocialOrWebsite,
  UserInfo
} from '~/models/schemas/Resume.schema'
import { ErrorWithStatus } from '~/models/Errors'

// export const createResumeValidator = (req: Request, res: Response, next: NextFunction) => {
//   const { body } = req
//   const errors = []
//   for (const item in body) {
//     if (typeof body[item] !== 'object') {
//       errors.push({
//         field: item,
//         message: `field ${item} must be an object`
//       })
//     }
//   }

//   if (errors.length > 0) {
//     return res.status(422).json({
//       result: errors
//     })
//   }

//   next()
// }

// wanted_job_title: string
// avatar: string
// first_name: string
// last_name: string
// email: string
// phone: string
// country: string
// city: string
// address?: string
// postal_code?: string
// driving_license?: string
// nationality?: string
// place_of_birth?: string
// date_of_birth?: string

// user_info?: UserInfo & PropertyName
//   professional_summary?: ProfessionalSummary & PropertyName
//   employment_historys?: EmploymentHistory[] & PropertyName
//   educations?: PropertyResumeOther[] & PropertyName
//   social_or_website?: SocialOrWebsite[] & PropertyName
//   skills?: Skill[] & PropertyName & Show
//   // not specified
//   hobbies?: Hobbies & PropertyName
//   references?: Reference[] & PropertyName & Show
//   languages?: Language[] & PropertyName
//   internships?: Internship[] & PropertyName
//   courses?: Course[] & PropertyName
//   extra_curricular_activities?: ExtraCurricularActivity[] & PropertyName
//   additional_info?: (CustomePropertyResume[] & PropertyName)[]
//   status?: StatusResume

function isValidISODate(dateString: string) {
  const date = new Date(dateString)
  return date.toISOString() === dateString
}

const userInfoSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      if (typeof values !== 'object') {
        throw new Error(`Invalid field value: user_info`)
      }

      const expectedFields = [
        'wanted_job_title',
        'avatar',
        'first_name',
        'last_name',
        'email',
        'phone',
        'country',
        'city',
        'address',
        'postal_code',
        'driving_license',
        'nationality',
        'place_of_birth',
        'date_of_birth',
        'property_name'
      ]

      const errors = []
      for (const key in values) {
        if (!expectedFields.includes(key)) {
          errors.push(`Field ${key} not found in user info`)
        }

        if (expectedFields.includes(key) && typeof values[key] !== 'string') {
          errors.push(`Field ${key} must be a string`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.toString())
      }

      return true
    }
  }
}

const professionalSummarySchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      if (typeof values !== 'object') {
        throw new Error(`Invalid field value: professional_summary`)
      }

      const expectedFields = ['content', 'property_name']

      const errors = []
      for (const key in values) {
        if (!expectedFields.includes(key)) {
          errors.push(`Field ${key} not found in professional_summary`)
        }

        if (expectedFields.includes(key) && typeof values[key] !== 'string') {
          errors.push(`Field ${key} must be a string`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.toString())
      }

      return true
    }
  }
}

const checkNestedSchema = (values: any, fieldName: string, listProperties1: string[], listProperties2: string[]) => {
  if (typeof values !== 'object') {
    throw new Error(`Invalid field value: ${fieldName}`)
  }

  const expectedFields = listProperties1

  const errors = []
  for (const key in values) {
    if (!expectedFields.includes(key)) {
      errors.push(`Field ${key} not found in ${fieldName}`)
    }

    if (expectedFields.includes(key) && key === 'property_name' && typeof values[key] !== 'string') {
      errors.push(`Field ${key} must be a string`)
    }
  }

  if (!Array.isArray(values['data'])) {
    errors.push(`Field data must be a array`)
  }
  for (let i = 0; i < values.data.length; i++) {
    const expectedDataFields = listProperties2

    for (const key in values.data[i]) {
      if (!expectedDataFields.includes(key)) {
        errors.push(`Field data[${i}].${key} not found in ${fieldName}`)
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
}

const employmentHistorySchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(
        values,
        'employment_histories',
        ['data', 'property_name'],
        ['city', 'start_date', 'end_date', 'description', 'job_title', 'employer']
      )
      return true
    }
  }
}

const educationsSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(
        values,
        'educations',
        ['data', 'property_name'],
        ['city', 'start_date', 'end_date', 'description', 'school', 'degree']
      )
      return true
    }
  }
}

const socialOrWebsiteSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(values, 'social_or_website', ['data', 'property_name'], ['label', 'link'])
      return true
    }
  }
}
const skillsSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(values, 'skills', ['data', 'property_name'], ['skill_name', 'level'])
      return true
    }
  }
}

const hobbieSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      if (typeof values !== 'object') {
        throw new Error(`Invalid field value: hobbies`)
      }

      const expectedFields = ['description', 'property_name']

      const errors = []
      for (const key in values) {
        if (!expectedFields.includes(key)) {
          errors.push(`Field ${key} not found in hobbies`)
        }

        if (expectedFields.includes(key) && typeof values[key] !== 'string') {
          errors.push(`Field ${key} must be a string`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.toString())
      }

      return true
    }
  }
}

const referencesSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(values, 'references', ['data', 'property_name'], ['name', 'company', 'phone', 'email'])
      return true
    }
  }
}

const languagesSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(values, 'references', ['data', 'property_name'], ['language', 'level'])
      return true
    }
  }
}

const internshipsSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(
        values,
        'references',
        ['data', 'property_name'],
        ['city', 'start_date', 'end_date', 'description', 'job_title', 'employer']
      )
      return true
    }
  }
}

const coursesSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(
        values,
        'references',
        ['data', 'property_name'],
        ['title', 'institution', 'start_date', 'end_date']
      )
      return true
    }
  }
}

const extraCASchema: ParamSchema = {
  optional: true,
  custom: {
    options: (values: any) => {
      checkNestedSchema(
        values,
        'references',
        ['data', 'property_name'],
        ['function_title', 'employer', 'start_date', 'end_date', 'city', 'description']
      )
      return true
    }
  }
}

export const createResumeValidator = validate(
  checkSchema(
    {
      user_info: userInfoSchema,
      professional_summary: professionalSummarySchema,
      employment_histories: employmentHistorySchema,
      educations: educationsSchema,
      social_or_website: socialOrWebsiteSchema,
      skills: skillsSchema,
      hobbies: hobbieSchema,
      references: referencesSchema,
      languages: languagesSchema,
      internships: internshipsSchema,
      courses: coursesSchema,
      extra_curricular_activities: extraCASchema,
      status: {
        optional: true,
        isString: true,
        notEmpty: true
      },
      additional_info: {
        optional: true,
        custom: {
          options: (values: any) => {
            if (!Array.isArray(values)) {
              throw new Error('Invalid additional_info')
            }
            for (let i = 0; i < values.length; i++) {
              checkNestedSchema(
                values[i],
                `additional_info[${i}]`,
                ['data', 'property_name'],
                ['city', 'start_date', 'end_date', 'description', 'title']
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
