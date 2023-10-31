import express from 'express'
import candidateControllers from '~/controllers/candidate.controllers'
import {
  createCandidateValidator,
  getCandidateValidator,
  updateCandidateValidator
} from '~/middlewares/candidate.middlewares'
import { accessTokenValidator, isEmployer } from '~/middlewares/users.middlewares'
const candidateRoute = express.Router()

candidateRoute.post('/', accessTokenValidator, createCandidateValidator, candidateControllers.createCandidate)
candidateRoute.patch('/', accessTokenValidator, updateCandidateValidator, candidateControllers.updateCandidate)
candidateRoute.get('/', accessTokenValidator, updateCandidateValidator, candidateControllers.getCandidate)
candidateRoute.post('/publish', accessTokenValidator, updateCandidateValidator, candidateControllers.publishCandidate)
candidateRoute.post('/hide', accessTokenValidator, updateCandidateValidator, candidateControllers.hideCandidate)
candidateRoute.get(
  '/:candidate_id',
  accessTokenValidator,
  isEmployer,
  getCandidateValidator,
  candidateControllers.getCandidateById
)

export default candidateRoute
