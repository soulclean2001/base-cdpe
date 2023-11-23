import { Request, Response, NextFunction } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasServices from '~/services/medias.services'
import { sendFileFromS3 } from '~/utils/s3'
import mime from 'mime'
import fs from 'fs'

class MediaController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    const url = await mediasServices.uploadImage(req)
    return res.json({
      message: USERS_MESSAGES.UPLOAD_SUCCESS,
      result: url
    })
  }

  async uploadPDF(req: Request, res: Response, next: NextFunction) {
    const url = await mediasServices.uploadPDF(req)

    return res.json({
      message: USERS_MESSAGES.UPLOAD_SUCCESS,
      result: url
    })
  }

  async serveImage(req: Request, res: Response, next: NextFunction) {
    const { name } = req.params
    return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
      if (err) {
        res.status((err as any).status).send('Not found')
      }
    })
  }
}

export default new MediaController()
