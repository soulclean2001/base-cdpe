import express from 'express'
import mediasControllers from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const mediasRouter = express.Router()

mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapAsync(mediasControllers.uploadImage)
)

mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapAsync(mediasControllers.uploadVideo)
)

mediasRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapAsync(mediasControllers.uploadVideoHLS)
)

mediasRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapAsync(mediasControllers.videoStatus)
)
export default mediasRouter
