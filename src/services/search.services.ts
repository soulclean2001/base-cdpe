import { escapeRegExp, isBoolean, isNumber, isUndefined } from 'lodash'
import { SearchCandidateReqParam, SearchCompanyParam, SearchJobReqParam } from '~/models/requests/Search.request'
import { removeUndefinedObject } from '~/utils/commons'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'

class SearchService {
  static async searchCandidate({
    limit,
    page,
    filter,
    user_id
  }: {
    limit: number
    page: number
    filter: SearchCandidateReqParam
    user_id: string
  }) {
    const match = SearchService.convertToQuerySearchCandidate(filter)
    // const match = {
    //   // name: 'xsdsadas'
    //   // working_location: ['abcd'],
    //   // academic_level: 'abcd',
    //   exp_year_from: 0
    //   // exp_year_to: 2,
    //   // foreign_language: 'en',
    //   // foreign_language_level: 'en',
    //   // industry: ['kasd']
    //   // job: 'webservice',
    //   // education_level: '0'
    // }

    console.log(match)

    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(user_id)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'Could not find company',
        status: 404
      })

    const [cvs, total] = await Promise.all([
      databaseServices.candidate
        .aggregate([
          {
            $match: {
              cv_public: true
            }
          },
          {
            $lookup: {
              from: 'resumes',
              localField: 'cv_id',
              foreignField: '_id',
              as: 'cvs'
            }
          },
          {
            $unwind: {
              path: '$cvs'
            }
          },
          {
            $match: match
          },
          {
            $lookup: {
              from: 'tracked_candidates',
              localField: '_id',
              foreignField: 'candidate_id',
              as: 'company_following'
            }
          },
          {
            $addFields: {
              is_follwing: {
                $in: [company._id, '$company_following.company_id']
              }
            }
          },
          {
            $project: {
              company_following: 0
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),

      databaseServices.candidate
        .aggregate([
          {
            $match: {
              cv_public: true
            }
          },
          {
            $lookup: {
              from: 'resumes',
              localField: 'cv_id',
              foreignField: '_id',
              as: 'cvs'
            }
          },
          {
            $unwind: {
              path: '$cvs'
            }
          },
          {
            $match: match
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      profiles: cvs,
      total: total[0]?.total || 0
    }
  }

  static convertToQuerySearchCandidate(data: SearchCandidateReqParam) {
    const match: any = {}

    if (data.name && data.name.length > 0) {
      data.name = data.name.trim()
      const keywords = data.name.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')
      match['$or'] = [
        { 'cvs.user_info.first_name': { $regex: regex } },
        { 'cvs.user_info.last_name': { $regex: regex } }
      ]
    }

    if (data.job && data.job.length > 0) {
      data.job = escapeRegExp(data.job.trim())
      match['cvs.user_info.wanted_job_title'] = {
        $regex: new RegExp('.*' + data.job + '.*', 'i')
      }
    }

    if (data.industry && data.industry.length > 0) {
      match['industry'] = {
        $in: [...data.industry]
      }
    }

    if (data.level && data.level.length > 0) {
      match['level'] = data.level
    }

    if (data.foreign_language && data.foreign_language.length > 0) {
      match['cvs.languages.data.language'] = data.foreign_language
    }

    if (data.foreign_language_level && data.foreign_language_level.length > 0) {
      match['cvs.languages.data.level'] = data.foreign_language_level
    }

    if (data.education_level && data.education_level.length > 0) {
      match['education_level'] = data.education_level
    }

    if (data.work_location && data.work_location.length > 0) {
      match['work_location'] = {
        $in: [...data.work_location]
      }
    }

    const year_from: number | undefined = data.exp_year_from
    const year_to: number | undefined = data.exp_year_to

    if (year_from !== undefined && year_to !== undefined) {
      match['experience'] = {
        $gte: year_from,
        $lte: year_to
      }
    } else if (year_from !== undefined) {
      match['experience'] = {
        $gte: year_from
      }
    } else if (year_to !== undefined) {
      match['experience'] = {
        $lte: year_to
      }
    }

    return match
  }

  static async searchJob(search: SearchJobReqParam) {
    const limit = Number(search.limit) || 10
    const page = Number(search.page) || 1
    const $match: {
      [key: string]: any
    } = {}

    if (search.content) {
      $match['$text'] = {
        $search: search.content
      }
    }
    if (search.working_location) {
      $match['working_locations.city_name'] = search.working_location
    }

    const [jobs, total] = await Promise.all([
      databaseServices.job
        .aggregate([
          {
            $match: {
              ...$match,
              visibility: true,
              status: 0
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.job
        .aggregate([
          {
            $match: {
              ...$match,
              visibility: true,
              status: 0
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    return {
      jobs,
      total: total[0]?.total || total,
      limit,
      page
    }
  }

  static async searchJob2({
    limit = 10,
    page = 1,
    filter
  }: {
    limit: number
    page: number
    filter: SearchJobReqParam
  }) {
    const $match: {
      [key: string]: any
    } = SearchService.convertQueryToMatchJob(filter)

    console.log($match)

    const $sort: {
      [key: string]: any
    } = {
      // 'salary_range.max': -1,
      // posted_date: -1
    }

    if (filter.sort_by_salary && isNumber(Number(filter.sort_by_salary))) {
      $sort['salary_range.max'] = Number(filter.sort_by_salary) >= 1 ? 1 : -1
    }

    if (filter.sort_by_post_date && isNumber(Number(filter.sort_by_post_date))) {
      $sort['posted_date'] = Number(filter.sort_by_post_date) >= 1 ? 1 : -1
    }

    console.log($sort)

    const [jobs, total] = await Promise.all([
      databaseServices.job
        .aggregate([
          {
            $match: {
              ...$match,
              visibility: true,
              status: 0
            }
          },
          {
            $sort
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.job
        .aggregate([
          {
            $match: {
              ...$match,
              visibility: true,
              status: 0
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    return {
      jobs,
      total: total[0]?.total || total,
      limit,
      page
    }
  }

  static async searchCompany(search: SearchCompanyParam, userId?: string) {
    const limit = Number(search.limit) || 10
    const page = Number(search.page) || 1

    const $match: {
      [key: string]: any
    } = {}

    if (search.content) {
      const keyword = search.content.trim()
      const keywords = keyword.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')
      $match['company_name'] = {
        $regex: regex
      }
    }

    if (search.field) {
      $match['fields'] = search.field
    }

    const [companies, total] = await Promise.all([
      databaseServices.company
        .aggregate([
          {
            $match
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
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.company
        .aggregate([
          {
            $match
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    return {
      companies,
      total: total[0]?.total || total,
      limit,
      page
    }
  }

  static convertQueryToMatchJob(filter: SearchJobReqParam) {
    const $match: {
      [key: string]: any
    } = {}

    if (filter.content) {
      $match['$text'] = {
        $search: filter.content
      }
    }

    if (filter.working_location) {
      $match['working_locations.city_name'] = filter.working_location
    }

    if (filter.career) {
      $match['careers'] = filter.career
    }

    if (filter.industry) {
      $match['industries'] = filter.industry
    }

    if (filter.job_level) {
      $match['job_level'] = filter.job_level
    }

    if (filter.job_type) {
      $match['job_type'] = filter.job_type
    }

    if (filter.is_expried) {
      const isTrueSet = /^true$/i.test(filter.is_expried)
      const now = new Date()
      if (isTrueSet) {
        $match['expired_date'] = {
          $lte: now
        }
      } else if (!isTrueSet) {
        $match['expired_date'] = {
          $gt: now
        }
      }
    }

    if (filter.salary) {
      if (filter.salary.min && isNumber(Number(filter.salary.min))) {
        const min = Number(filter.salary.min)
        $match['salary_range.max'] = {
          $gte: min
        }
      }

      if (filter.salary.max && isNumber(Number(filter.salary.max))) {
        const max = Number(filter.salary.max)
        if ($match['salary_range.max']) {
          const oldMatch = $match['salary_range.max']
          $match['salary_range.max'] = {
            ...oldMatch,
            $lte: max
          }
        } else {
          $match['salary_range.max'] = {
            $lte: max
          }
        }
      }
    }

    return $match
  }
}

export default SearchService
