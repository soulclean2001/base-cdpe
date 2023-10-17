import { Router } from 'express'
import searchControllers from '~/controllers/search.controllers'
import {
  searchCandidateMiddleware,
  searchCompanyMiddleware,
  searchJobMiddleware,
  searchJobMiddleware2
} from '~/middlewares/search.middlewares'
import wrapAsync from '~/utils/handlers'

const searchRouter = Router()
searchRouter.get('/candidate', searchCandidateMiddleware, wrapAsync(searchControllers.searchCandidate))
searchRouter.get('/company', searchCompanyMiddleware, wrapAsync(searchControllers.searchCompany))
searchRouter.get('/job', searchJobMiddleware, wrapAsync(searchControllers.searchJob))
searchRouter.get('/job2', searchJobMiddleware2, wrapAsync(searchControllers.searchJob2))

export default searchRouter
