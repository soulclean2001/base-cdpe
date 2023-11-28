import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserRole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { Media } from '~/models/Other'
import { UpdateCompanyReqBody } from '~/models/requests/Company.request'
import { TokenPayload } from '~/models/requests/User.request'
import CompanyService from '~/services/company.services'
import { sendEmail } from '~/utils/email'

class CompanyController {
  async updateCompany(req: Request<ParamsDictionary, any, UpdateCompanyReqBody>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { role, user_id } = req.decoded_authorization as TokenPayload
    if (role && role !== UserRole.Employer) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'You are not permissions granted to edit with this role'
      })
    }
    const result = await CompanyService.updateCompany({
      userId: user_id,
      payload: req.body,
      companyId: id
    })
    return res.json({
      message: 'Company updated successfully',
      result
    })
  }

  async getCompanyByMe(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { role, user_id } = req.decoded_authorization as TokenPayload

    const result = await CompanyService.getCompanyByMe(user_id)

    return res.json({
      message: 'get company',
      result
    })
  }

  async getCompanyById(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { company_id } = req.params
    const { query } = req

    if (query.user_id && !ObjectId.isValid(query.user_id as string)) {
      throw new ErrorWithStatus({
        status: 422,
        message: 'Invalid user id'
      })
    }

    const result = await CompanyService.getCompanyById(company_id, query.user_id as string)

    return res.json({
      message: 'get company',
      result
    })
  }

  async isFollowingCompanyId(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { company_id } = req.params
    const { role, user_id } = req.decoded_authorization as TokenPayload

    const result = await CompanyService.isFollowingCompanyId(user_id, company_id)

    return res.json({
      message: 'is following company',
      result
    })
  }

  async sales(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { role, user_id } = req.decoded_authorization as TokenPayload

    const result = await CompanyService.sales(user_id, req.query)

    return res.json({
      message: 'sales',
      result
    })
  }

  async totalJobs(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { role, user_id } = req.decoded_authorization as TokenPayload
    const { is_publish } = req.query
    const result = await CompanyService.totalJobs(user_id, is_publish as string)

    return res.json({
      message: 'total jobs',
      result
    })
  }

  async top10HasTheMostJobApplications(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { role, user_id } = req.decoded_authorization as TokenPayload
    const result = await CompanyService.top10HasTheMostJobApplications(user_id)

    return res.json({
      message: 'top 10 has the most job applications',
      result
    })
  }

  async sendEmail(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { role, user_id } = req.decoded_authorization as TokenPayload
    const { from_address, to_address, subject, data } = req.body
    const result = await sendEmail(from_address, to_address, subject, data)

    return res.json({
      message: 'send email',
      result
    })
  }
}

export default new CompanyController()
