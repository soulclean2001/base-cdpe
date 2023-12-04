import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { envConfig } from '~/constants/config'

export default class FollowerService {
  static async getCompanyByUser(user_id: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(user_id)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'User is not recruiter',
        status: 404
      })
    }
    return company
  }

  static async followRecruiter(user_id: string, company_id: string) {
    const company = await databaseServices.company.findOne({
      _id: new ObjectId(company_id)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Conpany not found',
        status: 404
      })
    }
    const followerExists = await databaseServices.companyFollowers.findOne({
      company_id: new ObjectId(company_id),
      user_id: new ObjectId(user_id)
    })

    if (followerExists) {
      return {
        message: 'You are following this company'
      }
    }

    await databaseServices.companyFollowers.insertOne({
      company_id: new ObjectId(company_id),
      user_id: new ObjectId(user_id)
    })

    return {
      message: 'followed company'
    }
  }

  static async unfollowRecruiter(user_id: string, company_id: string) {
    await databaseServices.companyFollowers.deleteOne({
      company_id: new ObjectId(company_id),
      user_id: new ObjectId(user_id)
    })

    return {
      message: 'unfollowed company'
    }
  }

  static async getCompaniesFollowedUser(user_id: string) {
    const listCompany = await databaseServices.companyFollowers
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id)
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: 'company_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company'
          }
        },
        {
          $project: {
            'company.users': 0
          }
        }
      ])

      .toArray()
    return listCompany
  }
}
