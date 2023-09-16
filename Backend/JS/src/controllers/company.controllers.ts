import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserRole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { Media } from '~/models/Other'
import { UpdateCompanyReqBody } from '~/models/requests/Company.request'
import { TokenPayload } from '~/models/requests/User.request'
import CompanyService from '~/services/company.services'
import mediasServices from '~/services/medias.services'

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
}

export default new CompanyController()