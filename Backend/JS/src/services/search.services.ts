import { escapeRegExp, isUndefined } from 'lodash'
import { SearchCandidateReqParam, SearchCompanyParam, SearchJobReqParam } from '~/models/requests/Search.request'
import { removeUndefinedObject } from '~/utils/commons'
import databaseServices from './database.services'

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
      cvs,
      total: total[0]?.total || 0
    }
  }

  static convertToQuerySearchCandidate(data: SearchCandidateReqParam) {
    const match: any = {}

    if (data.name && data.name.length > 0) {
      const keywords = data.name.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')
      data.name = data.name.trim()
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

    if (data.working_location && data.working_location.length > 0) {
      match['working_location'] = {
        $in: [...data.working_location]
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

  static async searchJob(filter: SearchJobReqParam) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1
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

    const [jobs, total] = await Promise.all([
      databaseServices.job
        .aggregate([
          {
            $match
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
            $match
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

  static async searchCompany(filter: SearchCompanyParam) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const $match: {
      [key: string]: any
    } = {}

    if (filter.content) {
      const keyword = filter.content.trim()
      const keywords = keyword.split(' ').map(escapeRegExp).join('|')
      const regex = new RegExp(`(?=.*(${keywords})).*`, 'i')
      $match['company_name'] = {
        $regex: regex
      }
    }

    if (filter.field) {
      $match['fields'] = filter.field
    }

    const [companies, total] = await Promise.all([
      databaseServices.company
        .aggregate([
          {
            $match
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
}

export default SearchService
