import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { envConfig } from '~/constants/config'

export default class FollowerService {
  static async followResume(user_id: string, resume_id: string) {
    const resume = await databaseServices.resume.findOne({
      _id: new ObjectId(resume_id)
    })

    if (!resume) {
      throw new ErrorWithStatus({
        message: 'Resume/CV not found',
        status: 404
      })
    }

    const company = await FollowerService.getCompanyByUser(user_id)

    const followerExists = await databaseServices.recruiterFollowedResumes.findOne({
      recruiter_id: company._id,
      resume_id: new ObjectId(resume_id)
    })

    if (followerExists) {
      return {
        message: 'You are following this resume'
      }
    }

    await databaseServices.recruiterFollowedResumes.insertOne({
      recruiter_id: company._id,
      resume_id: new ObjectId(resume_id)
    })

    return {
      message: 'followed resume'
    }
  }

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

  static async unfollowResume(user_id: string, resume_id: string) {
    const company = await FollowerService.getCompanyByUser(user_id)

    const rs = await databaseServices.recruiterFollowedResumes.deleteOne({
      recruiter_id: company._id,
      resume_id: new ObjectId(resume_id)
    })
    console.log(rs)
    return {
      message: 'unfollowed resume'
    }
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

  static async getResumesFollowedCompany(user_id: string) {
    const company = await FollowerService.getCompanyByUser(user_id)

    // const listResume = await databaseServices.recruiterFollowedResumes
    //   .find({
    //     recruiter_id: company._id
    //   })
    //   .toArray()

    const listResume = await databaseServices.recruiterFollowedResumes
      .aggregate([
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              recruiter_id: company._id
            }
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              resume_id: 1,
              _id: 0
            }
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: envConfig.dbResume,
              localField: 'resume_id',
              foreignField: '_id',
              as: 'followers'
            }
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: '$followers'
            }
        },
        {
          $match:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              'followers.is_show': true
            }
        },
        {
          $replaceRoot:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              newRoot: '$followers'
            }
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              user_id: 0
            }
        }
      ])
      .toArray()
    return listResume
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
