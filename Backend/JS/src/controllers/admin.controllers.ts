import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import JobService from '~/services/job.services'
import usersServices from '~/services/users.services'

class AdminController {
  async getUsersFromAdmin(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const query = req.query

    const result = await usersServices.getUsersFromAdmin(query)

    return res.json({
      message: 'Get users via admin',
      result
    })
  }

  async getPosts(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const query = req.query

    const result = await JobService.getPostsByAdmin(query)

    return res.json({
      message: 'Get posts by admin',
      result
    })
  }
}

export default new AdminController()
