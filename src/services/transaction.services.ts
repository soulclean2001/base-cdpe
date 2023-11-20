import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { ErrorWithStatus } from '~/models/Errors'

interface QueryTransaction {
  status?: string
  limit?: string
  page?: string
  sort_by_date?: string
}

class TransactionService {
  static convertQueryToMatch(filter: QueryTransaction) {
    const options: { [key: string]: any } = {}

    if (filter.status && !isNaN(Number(filter.status))) {
      options['transaction_status'] = filter.status
    }

    return options
  }

  static async getTransactionsByCompany(userId: string, filter: QueryTransaction) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'No company found',
        status: 404
      })

    const opts = this.convertQueryToMatch(filter) || {}

    const sortByDate = Number(filter.sort_by_date) || -1

    const [transactions, total] = await Promise.all([
      databaseServices.transaction
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'order_id',
              foreignField: '_id',
              as: 'order'
            }
          },
          {
            $unwind: {
              path: '$order'
            }
          },
          {
            $addFields: {
              company_id: '$order.company_id'
            }
          },
          {
            $match: {
              company_id: company._id
            }
          },
          {
            $project: {
              order: 0
            }
          },
          {
            $sort: {
              created_at: sortByDate
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
      databaseServices.transaction
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'order_id',
              foreignField: '_id',
              as: 'order'
            }
          },
          {
            $unwind: {
              path: '$order'
            }
          },
          {
            $addFields: {
              company_id: '$order.company_id'
            }
          },
          {
            $match: {
              company_id: company._id
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      transactions,
      total: total[0]?.total || 0,
      page,
      limit
    }
  }

  static async getTransactionsByAdmin(filter: QueryTransaction) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const opts = this.convertQueryToMatch(filter) || {}

    const sortByDate = Number(filter.sort_by_date) || -1

    const [transactions, total] = await Promise.all([
      databaseServices.transaction
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'order_id',
              foreignField: '_id',
              as: 'order'
            }
          },
          {
            $unwind: {
              path: '$order'
            }
          },
          {
            $addFields: {
              company_id: '$order.company_id'
            }
          },
          {
            $project: {
              order: 0
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
            $sort: {
              created_at: sortByDate
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
      databaseServices.transaction
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: 'order_id',
              foreignField: '_id',
              as: 'order'
            }
          },
          {
            $unwind: {
              path: '$order'
            }
          },
          {
            $addFields: {
              company_id: '$order.company_id'
            }
          },
          {
            $project: {
              order: 0
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
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      transactions,
      total: total[0]?.total || 0,
      page,
      limit
    }
  }
}

export default TransactionService
