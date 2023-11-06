import { Router } from 'express'
import mediasControllers from '~/controllers/medias.controllers'
import wrapAsync from '~/utils/handlers'

const staticRouter = Router()

staticRouter.get('/image/:name', wrapAsync(mediasControllers.serveImage))
staticRouter.get('/video-stream/:name', wrapAsync(mediasControllers.serveVideoStream))
staticRouter.get('/video-hls/:id/master.m3u8', wrapAsync(mediasControllers.serveM3u8))
staticRouter.get('/video-hls/:id/:v/:segment', wrapAsync(mediasControllers.serveSegment))

export default staticRouter
