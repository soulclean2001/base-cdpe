import { Router } from 'express'
import mediasControllers from '~/controllers/medias.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', mediasControllers.serveImage)
staticRouter.get('/video-stream/:name', mediasControllers.serveVideoStream)
staticRouter.get('/video-hls/:id/master.m3u8', mediasControllers.serveM3u8)
staticRouter.get('/video-hls/:id/:v/:segment', mediasControllers.serveSegment)

export default staticRouter
