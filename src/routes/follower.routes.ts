import { Router } from 'express'
import followerControllers from '~/controllers/follower.controllers'
import { accessTokenValidator, isCandidate, isEmployer } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const followerRouter = Router()

followerRouter.post('/company', accessTokenValidator, wrapAsync(followerControllers.followRecruiter))
// followerRouter.post('/company', accessTokenValidator, isCandidate, wrapAsync(followerControllers.followRecruiter))
followerRouter.delete('/company', accessTokenValidator, wrapAsync(followerControllers.unfollowRecruiter))
// followerRouter.post('/resume', accessTokenValidator, isEmployer, wrapAsync(followerControllers.followResume))
followerRouter.get('/company', accessTokenValidator, wrapAsync(followerControllers.getCompaniesFollowedUser))

export default followerRouter
