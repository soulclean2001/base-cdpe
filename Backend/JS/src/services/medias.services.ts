import path from 'path'
import { getFiles, getNameFromFullName, handleUploadVideo } from './../utils/file'
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
import databaseServices from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import { rimrafSync } from 'rimraf'
import { envConfig, isProduction } from '~/constants/config'
import { File } from 'formidable'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }

  async enqueue(item: string) {
    this.items.push(item)
    const idName = getNameFromFullName(item.split('/').pop() as string)
    await databaseServices.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }

  async processEncode() {
    if (this.encoding) return

    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getNameFromFullName(videoPath.split('/').pop() as string)
      await databaseServices.videoStatus.updateOne(
        {
          name: idName
        },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )

      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromise.unlink(videoPath)
        const files = getFiles(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await Promise.all(
          files.map((filepath) => {
            const filename = 'video-hls' + filepath.replace(path.resolve(UPLOAD_VIDEO_DIR), '')
            return uploadFileToS3({
              filepath,
              filename,
              contentType: mime.getType(filepath) as string
            })
          })
        )

        rimrafSync(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await databaseServices.videoStatus.updateOne(
          {
            name: idName
          },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )

        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await databaseServices.videoStatus
          .updateOne(
            {
              name: idName
            },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((err) => {
            console.error('Update video status error: ', err)
          })
        console.error(`Encode video ${videoPath} error`)
        console.error(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('Encode video queue is empty')
    }
  }
}

const queue = new Queue()

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

  public async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'videos/' + file.newFilename,
          filepath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })

        await Promise.all([fsPromise.unlink(file.filepath)])

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
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

  public async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${envConfig.port}/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }

  async getVideoStatus(id: string) {
    const data = await databaseServices.videoStatus.findOne({ name: id })
    return data
  }
}

export default new MediasService()
