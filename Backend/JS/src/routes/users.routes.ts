import express from 'express'
import authController from '~/controllers/auth.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidator, wrapAsync(authController.login))
usersRouter.post('/register', registerValidator, wrapAsync(authController.register))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(authController.logout))
usersRouter.post('/verify-email', wrapAsync(authController.logout))

export default usersRouter
