import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import databaseServices from '~/services/database.services'
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

  async sumany(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const order =
      (
        await databaseServices.order
          .aggregate([
            {
              $group: {
                _id: null,
                all_orders: {
                  $push: '$$ROOT'
                }
              }
            },
            {
              $project: {
                success_orders: {
                  $filter: {
                    input: '$all_orders',
                    as: 'orders',
                    cond: {
                      $eq: ['$$orders.status', 2]
                    }
                  }
                },
                all_orders: 1,
                _id: 0
              }
            },
            {
              $project: {
                all_orders: {
                  $size: '$all_orders'
                },
                success_orders: {
                  $size: '$success_orders'
                }
              }
            }
          ])
          .toArray()
      )[0] || []

    const totalCompany =
      (
        await databaseServices.company
          .aggregate([
            {
              $count: 'total'
            }
          ])
          .toArray()
      )[0]?.total || 0

    const totalPost =
      (
        await databaseServices.job
          .aggregate([
            {
              $match: {
                status: 0,
                visibility: true
              }
            },
            {
              $count: 'total'
            }
          ])
          .toArray()
      )[0]?.total || 0

    return res.json({
      message: 'sumany',
      result: {
        order: order,
        total_company: totalCompany,
        total_job: totalPost
      }
    })
  }

  async sales(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { query } = req

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
            }
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

    return res.json({
      message: 'sales',
      total: total[0]?.total || 0
    })
  }
}

export default new AdminController()
