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

  async summary(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
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
      message: 'summary',
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
      result: total[0]?.total || 0
    })
  }

  async top10CompanyOrderest(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
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

    const sort: {
      [key: string]: any
    } = {}

    if (query.f_price && query.f_price === '1') {
      sort['total_price'] = -1
    } else {
      sort['total_order'] = -1
    }

    const result = await databaseServices.order
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
            total: 1,
            company_id: 1
          }
        },
        {
          $match: {
            ...filter
          }
        },
        {
          $group: {
            _id: '$company_id',
            total_order: {
              $sum: 1
            },
            total_price: {
              $sum: '$total'
            }
          }
        },
        {
          $sort: {
            ...sort
          }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: 'company',
            localField: '_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            total_order: 1,
            total_price: 1,
            company: {
              _id: 1,
              logo: 1,
              company_name: 1
            }
          }
        }
      ])
      .toArray()

    return res.json({
      message: 'top 10 company orderest',
      result
    })
  }

  async top10CompanyHasTheMostJobs(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
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

    const result = await databaseServices.job
      .aggregate([
        {
          $match: {
            visibility: true,
            status: 0
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
            company_id: 1
          }
        },
        {
          $match: { ...filter }
        },
        {
          $group: {
            _id: '$company_id',
            total: {
              $sum: 1
            }
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: '_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $sort: {
            total: -1
          }
        },
        {
          $limit: 10
        },
        {
          $project: {
            total: 1,
            company: {
              _id: 1,
              logo: 1,
              company_name: 1
            }
          }
        }
      ])
      .toArray()

    return res.json({
      message: 'top 10 has the most jobs',
      result
    })
  }
}

export default new AdminController()
