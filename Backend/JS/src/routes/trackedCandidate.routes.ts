import express from 'express'
import trackedCandidateControllers from '~/controllers/trackedCandidate.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const trackedCandidateRouter = express.Router()

// unfollow
trackedCandidateRouter.post('/follow', accessTokenValidator, wrapAsync(trackedCandidateControllers.trackedCandidate))
trackedCandidateRouter.post(
  '/unfollow',
  accessTokenValidator,
  wrapAsync(trackedCandidateControllers.untrackedCandidate)
)

/* get list following by company
query: ?name=candidate_name
*/
trackedCandidateRouter.get('/', accessTokenValidator, wrapAsync(trackedCandidateControllers.getListTrackedCandidate))

export default trackedCandidateRouter
