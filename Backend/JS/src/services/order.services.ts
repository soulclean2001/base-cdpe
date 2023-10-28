import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Order, { StatusOrder } from '~/models/schemas/Order.schema'
import { ErrorWithStatus } from '~/models/Errors'
import ServiceOrder, { ServicePackageStatus } from '~/models/schemas/ServiceOrder.schema'
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

    const result = await databaseServices.order.insertOne(
      new Order({
        company_id: company._id,
        services: itemIds,
        total,
        discount: discount_percent,
        status: StatusOrder.WaitForPay
      })
    )
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
}

export default OrderService
