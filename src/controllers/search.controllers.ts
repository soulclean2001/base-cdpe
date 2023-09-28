import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Pagination, SearchCandidateReqBody } from '~/models/requests/Search.request'
import SearchService from '~/services/search.services'

class SearchController {
  async searchCandidate(req: Request<ParamsDictionary, any, any, any>, res: Response) {
    const limit = Number(req.query.limit)
    const page = Number(req.query.page)
    const query = req.query as SearchCandidateReqBody
    query.exp_year_from = isNaN(Number(query.exp_year_from)) ? undefined : Number(query.exp_year_from)
    query.exp_year_to = isNaN(Number(query.exp_year_to)) ? undefined : Number(query.exp_year_to)
    console.log(query)

    const result = await SearchService.searchCandidate({ limit, page, filter: query, user_id: 'asd' })

    return res.json({
      message: 'Search',
      result
    })
  }
}

export default new SearchController()
