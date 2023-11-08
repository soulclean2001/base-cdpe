import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Order, { StatusOrder } from '~/models/schemas/Order.schema'
import { ErrorWithStatus } from '~/models/Errors'
import ServiceOrder, { ServicePackageStatus } from '~/models/schemas/ServiceOrder.schema'
import { fi } from '@faker-js/faker'
import { PackageType } from '~/constants/enums'

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

    const oldPkgs = await databaseServices.serviceOrder
      .find({
        code: PackageType.BANNER,
        status: ServicePackageStatus.Active
      })
      .sort({
        created_at: -1
      })
      .limit(1)
      .toArray()

    let tempdate = oldPkgs[0]?.expired_at || now
    let diffTime = Math.abs((tempdate as any) - (now as any))
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    for (let i = 0; i < items.length; i++) {
      total += packages[i].discount_price * items[i].quantity
      const date = new Date(now)
      if (packages[i].type === PackageType.BANNER) {
        date.setDate(now.getDate() + packages[i].number_of_days_to_expire * items[i].quantity + diffDays)
        diffTime = Math.abs((date as any) - (tempdate as any))
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        tempdate = date
      }
      let value = 1
      if (packages[i].type === PackageType.POST) {
        value = packages[i].value * items[i].quantity
      } else {
        value = packages[i].number_of_days_to_expire * items[i].quantity
      }
      services.push(
        new ServiceOrder({
          status: ServicePackageStatus.Canceled,
          company_id: company._id,
          quantity: items[i].quantity,
          expired_at: date,
          package_id: packages[i]._id,
          unit_price: packages[i].discount_price,
          order_id: new ObjectId(),
          code: packages[i].type,
          value: value
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

    const cart = await databaseServices.cart.findOne({
      user_id: new ObjectId(user_id)
    })

    const cartItems = await databaseServices.cartItem
      .find({
        cart_id: cart?._id
      })
      .toArray()

    if (cartItems) {
      const newCartItems = []
      for (let i = 0; i < cartItems.length; i++) {
        for (let j = 0; j < items.length; j++) {
          if (items[j].item_id === cartItems[i].item.item_id) {
            if (items[j].quantity < cartItems[i].item.quantity) {
              cartItems[i].item.quantity = cartItems[i].item.quantity - items[j].quantity
              newCartItems.push(cartItems[i])
            } else if (items[j].quantity === cartItems[i].item.quantity) {
              await databaseServices.cartItem.deleteOne({
                item: {
                  item_id: cartItems[i].item.item_id
                }
              })
            }
            break
          }
        }
      }

      for (let i = 0; i < newCartItems.length; i++) {
        await databaseServices.cartItem.updateOne(
          {
            _id: newCartItems[i]._id
          },
          {
            $set: {
              item: newCartItems[i].item
            }
          }
        )
      }
    }

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

  static async activeServiceOrder(id: string) {
    const service = await databaseServices.serviceOrder.findOne({
      _id: new ObjectId(id)
    })

    if (service && service.status === ServicePackageStatus.UnActive) {
      const serviceOrder = await databaseServices.serviceOrder.findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $set: {
            status: ServicePackageStatus.Active
          }
        },
        {
          returnDocument: 'after'
        }
      )

      const company = await databaseServices.company.findOne({
        _id: serviceOrder.value?.company_id
      })

      if (service.code === PackageType.POST && company && serviceOrder) {
        await databaseServices.company.updateOne(
          {
            _id: serviceOrder.value?.company_id
          },
          {
            $set: {
              number_of_posts: company.number_of_posts + service.value
            }
          }
        )
      }
    }
  }

  static async getAllCompanyBuyBannerStillValid() {
    const companies = await databaseServices.serviceOrder
      .aggregate([
        {
          $match: {
            code: 'BANNER',
            status: 0,
            expired_at: {
              $gte: new Date()
            }
          }
        },
        {
          $group: {
            _id: '$company_id'
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
            path: '$company'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$company'
          }
        },
        {
          $project: {
            users: 0
          }
        }
      ])
      .toArray()

    return companies
  }

  static async getAllJobHasCompanyBuyBannerStillValid() {
    const companies = await databaseServices.serviceOrder
      .aggregate([
        {
          $match: {
            code: 'BANNER',
            status: 0,
            expired_at: {
              $gte: new Date()
            }
          }
        },
        {
          $group: {
            _id: '$company_id'
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
            path: '$company'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$company'
          }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: '_id',
            foreignField: 'company_id',
            as: 'job'
          }
        },
        {
          $unwind: {
            path: '$job'
          }
        },
        {
          $sort: {
            'job.posted_date': -1
          }
        },
        {
          $match: {
            'job.visibility': true,
            'job.status': 0
          }
        },
        {
          $project: {
            users: 0,
            'job.company': 0
          }
        }
      ])
      .toArray()

    return companies
  }
}

export default OrderService
