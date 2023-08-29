import express from 'express'
import companyControllers from '~/controllers/company.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { updateCompanyValidator } from '~/middlewares/company.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { UpdateCompanyReqBody } from '~/models/requests/Company.request'
import wrapAsync from '~/utils/handlers'

const companyRouter = express.Router()

companyRouter.patch(
  '/:id',
  accessTokenValidator,
  updateCompanyValidator,
  filterMiddleware<UpdateCompanyReqBody>(['company_name', 'province', 'district', 'company_info', 'company_size']),
  wrapAsync(companyControllers.updateCompany)
)

export default companyRouter
