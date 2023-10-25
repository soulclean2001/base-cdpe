import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Pagination, SearchCandidateReqParam } from '~/models/requests/Search.request'
import { TokenPayload } from '~/models/requests/User.request'
import SearchService from '~/services/search.services'

class SearchController {
  async searchCandidate(req: Request<ParamsDictionary, any, any, any>, res: Response) {
    const limit = Number(req.query.limit)
    const page = Number(req.query.page)
    const query = req.query as SearchCandidateReqParam
    query.exp_year_from = isNaN(Number(query.exp_year_from)) ? undefined : Number(query.exp_year_from)
    query.exp_year_to = isNaN(Number(query.exp_year_to)) ? undefined : Number(query.exp_year_to)
    console.log(query)

    const result = await SearchService.searchCandidate({ limit, page, filter: query, user_id: 'asd' })

    return res.json({
      message: 'Search',
      result
    })
  }

  async searchJob(req: Request<ParamsDictionary, any, any, any>, res: Response) {
    const query = req.query

    const result = await SearchService.searchJob(query)

    return res.json({
      message: 'search jobs',
      result
    })
  }

  async searchJob2(req: Request<ParamsDictionary, any, any, any>, res: Response) {
    const query = req.query
    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    console.log('query', query)

    const result = await SearchService.searchJob2({
      limit,
      page,
      filter: query
    })

    return res.json({
      message: 'search jobs',
      result
    })
  }

  async searchCompany(req: Request<ParamsDictionary, any, any, any>, res: Response) {
    const query = req.query

    const result = await SearchService.searchCompany(query)

    return res.json({
      message: 'search companies',
      result
    })
  }
}

export default new SearchController()
