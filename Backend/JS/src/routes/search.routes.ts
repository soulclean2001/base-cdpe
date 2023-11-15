import { Router } from 'express'
import { access } from 'fs'
import searchControllers from '~/controllers/search.controllers'
import {
  searchCandidateMiddleware,
  searchCompanyMiddleware,
  searchJobMiddleware,
  searchJobMiddleware2
} from '~/middlewares/search.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const searchRouter = Router()
searchRouter.get(
  '/candidate',
  accessTokenValidator,
  searchCandidateMiddleware,
  wrapAsync(searchControllers.searchCandidate)
)

/**
 * query?user_id=id -> check is_following
 */
searchRouter.get('/company', searchCompanyMiddleware, wrapAsync(searchControllers.searchCompany))
searchRouter.get('/job', searchJobMiddleware, wrapAsync(searchControllers.searchJob))
searchRouter.get('/job2', searchJobMiddleware2, wrapAsync(searchControllers.searchJob2))

export default searchRouter