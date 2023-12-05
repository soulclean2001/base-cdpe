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

mediasRouter.post('/upload-pdf', accessTokenValidator, verifiedUserValidator, wrapAsync(mediasControllers.uploadPDF))

export default mediasRouter
