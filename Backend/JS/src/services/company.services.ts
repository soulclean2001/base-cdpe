import { PositionType, UpdateCompanyReqBody } from '~/models/requests/Company.request'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { Media } from '~/models/Other'
import { omit } from 'lodash'
import { deleteFileFromS3 } from '~/utils/s3'

class CompanyService {
  static async updateCompany({
    userId,
    payload,
    companyId
  }: {
    userId: string
    payload: UpdateCompanyReqBody
    companyId: string
  }) {
    const oldCompany = await CompanyService.getCompany(companyId)

    const _payload = omit(payload, ['logo_image_file', 'background_image_file'])
    const rs = await databaseServices.company.findOneAndUpdate(
      {
        _id: new ObjectId(companyId),
        users: [
          {
            user_id: new ObjectId(userId),
            position: PositionType.Admin
          }
        ]
      },
      {
        $set: {
          ..._payload
        }
      },
      {
        returnDocument: 'after'
      }
    )
    // delete image old from s3
    if (oldCompany) {
      const oldUrls = []
      if (oldCompany.background && _payload.background !== undefined) {
        const convertToS3Url = oldCompany.background.match(/images\/.*/)
        if (convertToS3Url && convertToS3Url.length > 0) oldUrls.push(convertToS3Url[0])
      }
      if (oldCompany.logo && _payload.logo !== undefined) {
        const convertToS3Url = oldCompany.logo.match(/images\/.*/)
        if (convertToS3Url && convertToS3Url.length > 0) oldUrls.push(convertToS3Url[0])
      }

      if (oldUrls.length === 1) await deleteFileFromS3(oldUrls[0])
      if (oldUrls.length === 2) await Promise.all([deleteFileFromS3(oldUrls[0]), deleteFileFromS3(oldUrls[1])])
    }
    return rs.value
  }

  static async getCompany(companyId: string) {
    return await databaseServices.company.findOne({
      _id: new ObjectId(companyId)
    })
  }
}

export default CompanyService
