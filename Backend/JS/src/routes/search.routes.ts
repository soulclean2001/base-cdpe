import { Router } from 'express'
import searchControllers from '~/controllers/search.controllers'
import { searchCandidateMiddleware } from '~/middlewares/search.middlewares'
import wrapAsync from '~/utils/handlers'

const searchRouter = Router()
searchRouter.get('/candidate', searchCandidateMiddleware, wrapAsync(searchControllers.searchCandidate))

export default searchRouter
