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
    if (rs.ok && rs.value) {
      await databaseServices.job.updateMany(
        {
          company_id: rs.value._id
        },
        {
          $set: {
            company: omit(rs.value, ['_id', 'users'])
          }
        }
      )
    }

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

  static async getCompanyById(companyId: string, userId?: string) {
    const companies = await databaseServices.company
      .aggregate([
        {
          $match: {
            _id: new ObjectId(companyId)
          }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: '_id',
            foreignField: 'company_id',
            as: 'job_num'
          }
        },
        {
          $addFields: {
            job_num: {
              $size: '$job_num'
            }
          }
        },
        {
          $lookup: {
            from: 'user_company_follows',
            localField: '_id',
            foreignField: 'company_id',
            as: 'follow_num'
          }
        },
        {
          $addFields: {
            is_following: {
              $in: [userId ? new ObjectId(userId) : '', '$follow_num.user_id']
            },
            follow_num: {
              $size: '$follow_num'
            }
          }
        }
      ])
      .toArray()

    return companies[0] || {}
  }

  static async getCompanyByMe(userId: string) {
    return await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })
  }

  static async isFollowingCompanyId(userId: string, companyId: string) {
    const companyFollowed = await databaseServices.companyFollowers.findOne({
      company_id: new ObjectId(companyId),
      user_id: new ObjectId(userId)
    })

    return companyFollowed ? true : false
  }

  static async getCompanyFollowing(userId: string) {
    const companyFollowed = await databaseServices.companyFollowers.aggregate([
      {
        $match: {
          user_id: new ObjectId(userId)
        }
      },
      {}
    ])

    return companyFollowed ? true : false
  }
}

export default CompanyService
