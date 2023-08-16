import express from 'express'
import authController from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.request'
import wrapAsync from '~/utils/handlers'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidator, wrapAsync(authController.login))
usersRouter.post('/register', registerValidator, wrapAsync(authController.register))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(authController.logout))
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(authController.verifyEmail))
usersRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(authController.refreshToken))
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(authController.resendVerifyEmail))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(authController.forgotPassword))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(authController.verifyForgotPassword)
)

usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(authController.resetPassword))
usersRouter.get('/me', accessTokenValidator, wrapAsync(authController.getMe))
usersRouter.get('/:username', wrapAsync(authController.getProfile))
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapAsync(authController.changePassword)
)

usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>(['name', 'date_of_birth', 'username', 'avatar', 'cover_photo']),
  wrapAsync(authController.updateMe)
)
// login with google
usersRouter.get('/oauth/google', wrapAsync(authController.oauth))
export default usersRouter
