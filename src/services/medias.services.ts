import path from 'path'
import { getFiles, getNameFromFullName, handleUploadPDF } from './../utils/file'
import { Request } from 'express'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { Media } from '~/models/Other'
import { handleUploadImage } from '~/utils/file'
import sharp from 'sharp'
import mime from 'mime'
import fsPromise from 'fs/promises'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { uploadFileToS3 } from '~/utils/s3'

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullFileName,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })

        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
    // return {
    //   url: isProduction
    //     ? `${process.env.HOST}/static/image/${newFullFilename}`
    //     : `http://localhost:${process.env.PORT}/static/image/${newFullFilename}`,
    //   type: MediaType.Image
    // }
  }

  public async uploadPDF(req: Request) {
    const files = await handleUploadPDF(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'images/' + file.newFilename,
          filepath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })

        await Promise.all([fsPromise.unlink(file.filepath)])

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.PDF
        }
      })
    )
    return result
    // return {
    //   url: isProduction
    //     ? `${process.env.HOST}/static/video/${file.newFilename}`
    //     : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
    //   type: MediaType.Video
    // }
  }
}

export default new MediasService()
