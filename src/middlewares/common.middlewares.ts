import { NextFunction, Request, Response } from 'express'
import { ParamSchema } from 'express-validator'
import { pick } from 'lodash'

type FilterKeys<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }

export const isStringNotEmpty = (field: string): ParamSchema => {
  return {
    isString: {
      errorMessage: `${field} must be a string`
    },
    notEmpty: {
      errorMessage: `${field} must not be empty`
    }
  }
}

export const isISO8601 = (field: string): ParamSchema => {
  return {
    isISO8601: {
      options: {
        strict: true,
        strictSeparator: true
      },
      errorMessage: `${field} must be a valid ISO8601`
    }
  }
}
