import { PositionType, UpdateCompanyReqBody } from '~/models/requests/Company.request'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { Media } from '~/models/Other'
import { omit } from 'lodash'
import { deleteFileFromS3 } from '~/utils/s3'
import { ErrorWithStatus } from '~/models/Errors'

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
              $filter: {
                input: '$job_num',
                as: 'job',
                cond: {
                  $and: [
                    {
                      $eq: ['$$job.status', 0]
                    },
                    {
                      $eq: ['$$job.visibility', true]
                    }
                  ]
                }
              }
            }
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
        },
        {
          $project: {
            number_of_posts: 0
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

  static async sales(userId: string, query: { year?: string; month?: string }) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'Company not found',
        status: 404
      })

    const filter: {
      month?: number
      year?: number
    } = {}

    if (query.year && !isNaN(Number(query.year))) {
      filter.year = Number(query.year)
    }

    if (query.month && !isNaN(Number(query.month))) {
      filter.month = Number(query.month)

      if (!filter.year) {
        filter.year = new Date().getFullYear()
      }
    }

    const total = await databaseServices.order
      .aggregate([
        {
          $match: {
            status: {
              $in: [5, 2]
            },
            company_id: company._id
          }
        },
        {
          $project: {
            month: {
              $month: '$created_at'
            },
            year: {
              $year: '$created_at'
            },
            total: 1
          }
        },
        {
          $match: {
            ...filter
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$total'
            }
          }
        }
      ])
      .toArray()

    return total[0]?.total || 0
  }

  static async totalJobs(userId: string, isPublish?: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'Company not found',
        status: 404
      })

    const match: {
      [key: string]: any
    } = {}

    if (isPublish && isPublish === '1') {
      match['status'] = 0
      match['visibility'] = true
    }

    const total = await databaseServices.job
      .aggregate([
        {
          $match: {
            ...match,
            company_id: company._id
          }
        },
        {
          $group: {
            _id: null,
            total_jobs: {
              $sum: 1
            }
          }
        }
      ])
      .toArray()

    return total[0]?.total_jobs || 0
  }

  static async top10HasTheMostJobApplications(userId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'Company not found',
        status: 404
      })

    const result = await databaseServices.job
      .aggregate([
        {
          $match: {
            company_id: company._id
          }
        },
        {
          $lookup: {
            from: 'job_applications',
            localField: '_id',
            foreignField: 'job_post_id',
            as: 'total_job_applications'
          }
        },
        {
          $addFields: {
            total_job_applications: {
              $size: '$total_job_applications'
            }
          }
        },
        {
          $sort: {
            total_job_applications: -1
          }
        },
        {
          $limit: 10
        }
      ])
      .toArray()

    return result
  }
}

export default CompanyService