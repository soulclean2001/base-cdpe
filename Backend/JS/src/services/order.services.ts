import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Order, { StatusOrder } from '~/models/schemas/Order.schema'
import { ErrorWithStatus } from '~/models/Errors'
import ServiceOrder, { ServicePackageStatus } from '~/models/schemas/ServiceOrder.schema'
import { fi } from '@faker-js/faker'

interface QueryOrder {
  status?: string
  limit?: string
  page?: string
  sort_by_date?: string
}

class OrderService {
  static async order({
    user_id,
    items
  }: {
    user_id: string
    items: {
      item_id: string
      quantity: number
    }[]
  }) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(user_id)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'No company found',
        status: 405
      })
    }

    const itemIds = items.map((item) => new ObjectId(item.item_id))

    const packages = await databaseServices.package
      .find({
        _id: {
          $in: itemIds
        }
      })
      .toArray()

    if (!packages || packages.length < 1 || packages.length !== itemIds.length) {
      throw new ErrorWithStatus({
        message: 'No service found',
        status: 405
      })
    }

    let total = 0
    const services: ServiceOrder[] = []
    const now = new Date()
    for (let i = 0; i < items.length; i++) {
      total += packages[i].discount_price * items[i].quantity
      const date = new Date(now)
      date.setDate(now.getDate() + packages[i].number_of_days_to_expire * items[i].quantity)

      services.push(
        new ServiceOrder({
          status: ServicePackageStatus.Canceled,
          company_id: company._id,
          quantity: items[i].quantity,
          expired_at: date,
          package_id: packages[i]._id,
          unit_price: packages[i].discount_price,
          order_id: new ObjectId(),
          code: ''
        })
      )
    }

    const discount_percent = 0
    total = total - total * discount_percent

    const od = new Order({
      company_id: company._id,
      services: itemIds,
      total,
      discount: discount_percent,
      status: StatusOrder.WaitForPay
    })

    const result = await databaseServices.order.insertOne(od)
    if (result) {
      for (let i = 0; i < services.length; i++) {
        services[i].order_id = result.insertedId
      }
    }
    od._id = result.insertedId

    const servicesSaved = await databaseServices.serviceOrder.insertMany(services)

    return {
      order: od,
      packages
    }
  }

  static convertQueryToMatch(filter: QueryOrder) {
    const options: { [key: string]: any } = {}

    if (filter.status && !isNaN(Number(filter.status))) {
      options['status'] = Number(filter.status)
    }

    return options
  }

  static async getAllOrdersByCompany(userId: string, filter: QueryOrder) {
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

    const [orders, total] = await Promise.all([
      databaseServices.order
        .aggregate([
          {
            $match: {
              company_id: company._id,
              ...opts
            }
          },
          {
            $unwind: {
              path: '$services'
            }
          },
          {
            $lookup: {
              from: 'packages',
              localField: 'services',
              foreignField: '_id',
              as: 'package'
            }
          },
          {
            $unwind: {
              path: '$package'
            }
          },
          {
            $group: {
              _id: '$_id',
              packages: {
                $push: '$package'
              }
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: '_id',
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
            $lookup: {
              from: 'service_orders',
              localField: '_id',
              foreignField: 'order_id',
              as: 'service_orders'
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
      databaseServices.order
        .aggregate([
          {
            $match: {
              company_id: company._id,
              ...opts
            }
          },
          {
            $unwind: {
              path: '$services'
            }
          },
          {
            $lookup: {
              from: 'packages',
              localField: 'services',
              foreignField: '_id',
              as: 'package'
            }
          },
          {
            $unwind: {
              path: '$package'
            }
          },
          {
            $group: {
              _id: '$_id',
              packages: {
                $push: '$package'
              }
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: '_id',
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
            $lookup: {
              from: 'service_orders',
              localField: '_id',
              foreignField: 'order_id',
              as: 'service_orders'
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      orders,
      total: total[0]?.total || 0,
      limit,
      page
    }
  }

  static async getOrdersDetailByCompany(userId: string, orderId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'No company found',
        status: 404
      })

    const order = await databaseServices.order
      .aggregate([
        {
          $match: {
            company_id: company._id,
            _id: new ObjectId(orderId)
          }
        },
        {
          $unwind: {
            path: '$services'
          }
        },
        {
          $lookup: {
            from: 'packages',
            localField: 'services',
            foreignField: '_id',
            as: 'package'
          }
        },
        {
          $unwind: {
            path: '$package'
          }
        },
        {
          $group: {
            _id: '$_id',
            packages: {
              $push: '$package'
            }
          }
        },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
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
          $lookup: {
            from: 'service_orders',
            localField: '_id',
            foreignField: 'order_id',
            as: 'service_orders'
          }
        }
      ])
      .toArray()

    return order[0] || {}
  }

  static async getOrdersDetailByAdmin(orderId: string) {
    const order = await databaseServices.order
      .aggregate([
        {
          $match: {
            _id: new ObjectId(orderId)
          }
        },
        {
          $unwind: {
            path: '$services'
          }
        },
        {
          $lookup: {
            from: 'packages',
            localField: 'services',
            foreignField: '_id',
            as: 'package'
          }
        },
        {
          $unwind: {
            path: '$package'
          }
        },
        {
          $group: {
            _id: '$_id',
            packages: {
              $push: '$package'
            }
          }
        },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
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
          $lookup: {
            from: 'service_orders',
            localField: '_id',
            foreignField: 'order_id',
            as: 'service_orders'
          }
        }
      ])
      .toArray()

    return order[0] || {}
  }

  static async getAllOrdersByAdmin(filter: QueryOrder) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const opts = this.convertQueryToMatch(filter) || {}

    const sortByDate = Number(filter.sort_by_date) || -1
    console.log(opts, sortByDate)

    const [orders, total] = await Promise.all([
      databaseServices.order
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $unwind: {
              path: '$services'
            }
          },
          {
            $lookup: {
              from: 'packages',
              localField: 'services',
              foreignField: '_id',
              as: 'package'
            }
          },
          {
            $unwind: {
              path: '$package'
            }
          },
          {
            $group: {
              _id: '$_id',
              packages: {
                $push: '$package'
              }
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: '_id',
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
            $lookup: {
              from: 'service_orders',
              localField: '_id',
              foreignField: 'order_id',
              as: 'service_orders'
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          },
          {
            $sort: {
              'order.created_at': sortByDate
            }
          }
        ])
        .toArray(),
      databaseServices.order
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $unwind: {
              path: '$services'
            }
          },
          {
            $lookup: {
              from: 'packages',
              localField: 'services',
              foreignField: '_id',
              as: 'package'
            }
          },
          {
            $unwind: {
              path: '$package'
            }
          },
          {
            $group: {
              _id: '$_id',
              packages: {
                $push: '$package'
              }
            }
          },
          {
            $lookup: {
              from: 'orders',
              localField: '_id',
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
            $lookup: {
              from: 'service_orders',
              localField: '_id',
              foreignField: 'order_id',
              as: 'service_orders'
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      orders,
      total: total[0]?.total || 0,
      limit,
      page
    }
  }
}

export default OrderService
