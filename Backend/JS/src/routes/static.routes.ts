import { Router } from 'express'
import mediasControllers from '~/controllers/medias.controllers'
import wrapAsync from '~/utils/handlers'

const staticRouter = Router()

staticRouter.get('/image/:name', wrapAsync(mediasControllers.serveImage))

export default staticRouter
