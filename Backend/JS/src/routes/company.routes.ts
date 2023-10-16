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
  filterMiddleware<UpdateCompanyReqBody>([
    'company_name',
    'company_info',
    'company_size',
    'logo',
    'background',
    'working_locations',
    'fields'
  ]),
  wrapAsync(companyControllers.updateCompany)
)

companyRouter.get('/me', accessTokenValidator, wrapAsync(companyControllers.getCompanyByMe))

export default companyRouter
