import express from 'express'
import companyControllers from '~/controllers/company.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { sendEmailValidator, updateCompanyValidator } from '~/middlewares/company.middlewares'
import { idValidator } from '~/middlewares/jobApplication.middlewares'
import { accessTokenValidator, isEmployer } from '~/middlewares/users.middlewares'
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
    'fields',
    'pictures',
    'videos'
  ]),
  wrapAsync(companyControllers.updateCompany)
)

companyRouter.get('/me', accessTokenValidator, wrapAsync(companyControllers.getCompanyByMe))

// is following company
companyRouter.get(
  '/:company_id/is_following',
  accessTokenValidator,
  idValidator('company_id'),
  wrapAsync(companyControllers.isFollowingCompanyId)
)

/*
  query: {
    month?: number,
    year?: number || (month ? now year : undefined), 
  }

*/
companyRouter.get('/sales', accessTokenValidator, isEmployer, wrapAsync(companyControllers.sales))

/*
  undefined = để trống
  query: {
    is_publish: 1 || undefined
  }

*/
companyRouter.get('/total-jobs', accessTokenValidator, isEmployer, wrapAsync(companyControllers.totalJobs))
companyRouter.get(
  '/top-10-jobs-has-the-most-applications',
  accessTokenValidator,
  isEmployer,
  wrapAsync(companyControllers.top10HasTheMostJobApplications)
)

/* 
  query:{
    user_id?:string
  }
*/
companyRouter.get('/:company_id', idValidator('company_id'), wrapAsync(companyControllers.getCompanyById))

/**
 * body: {
 * from_address:string,
 * to_address:string,
 * data: string,
 * subject: string
 * }
 */
companyRouter.post('/send-email', sendEmailValidator, accessTokenValidator, wrapAsync(companyControllers.sendEmail))

export default companyRouter
