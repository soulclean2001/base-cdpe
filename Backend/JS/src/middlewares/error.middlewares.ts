import { Response, NextFunction, Request } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
  }

  if (err['$metadata']) {
    return res.status(err['$metadata'].httpStatusCode).json({
      message: err.message,
      errorInfo: omit(err, ['stack'])
    })
  }

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true, configurable: true })
  })

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: err
  })
}
