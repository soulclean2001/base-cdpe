import express from 'express'
import trackedCandidateControllers from '~/controllers/trackedCandidate.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const trackedCandidateRouter = express.Router()

// unfollow
trackedCandidateRouter.post('/follow', accessTokenValidator, trackedCandidateControllers.trackedCandidate)
trackedCandidateRouter.post('/unfollow', accessTokenValidator, trackedCandidateControllers.untrackedCandidate)

/* get list following by company
query: ?name=candidate_name
*/
trackedCandidateRouter.get('/', accessTokenValidator, trackedCandidateControllers.getListTrackedCandidate)

export default trackedCandidateRouter
