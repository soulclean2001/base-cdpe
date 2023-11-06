import express from 'express'
import candidateControllers from '~/controllers/candidate.controllers'
import {
  createCandidateValidator,
  getCandidateValidator,
  updateCandidateValidator
} from '~/middlewares/candidate.middlewares'
import { accessTokenValidator, isEmployer } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'
const candidateRoute = express.Router()

candidateRoute.post(
  '/',
  accessTokenValidator,
  createCandidateValidator,
  wrapAsync(candidateControllers.createCandidate)
)
candidateRoute.patch(
  '/',
  accessTokenValidator,
  updateCandidateValidator,
  wrapAsync(candidateControllers.updateCandidate)
)
candidateRoute.get('/', accessTokenValidator, updateCandidateValidator, wrapAsync(candidateControllers.getCandidate))
candidateRoute.post(
  '/publish',
  accessTokenValidator,
  updateCandidateValidator,
  wrapAsync(candidateControllers.publishCandidate)
)
candidateRoute.post(
  '/hide',
  accessTokenValidator,
  updateCandidateValidator,
  wrapAsync(candidateControllers.hideCandidate)
)
candidateRoute.get(
  '/:candidate_id',
  accessTokenValidator,
  isEmployer,
  getCandidateValidator,
  wrapAsync(candidateControllers.getCandidateById)
)

export default candidateRoute
