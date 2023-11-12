import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { ItemType } from '~/models/schemas/Cart.schema'
import { PackageStatus } from '~/models/schemas/Package.schema'
import databaseServices from '~/services/database.services'
import { validate } from '~/utils/validation'

export const orderItemValidator = validate(
  checkSchema(
    {
      items: {
        custom: {
          options: async (values: any) => {
            if (!Array.isArray(values)) throw new Error('items must be an array')
            const expectedKeys = ['quantity', 'item_id']
            for (let i = 0; i < values.length; i++) {
              const value = values[i]
              if (typeof value !== 'object') {
                throw new Error(`item must be an object`)
              }
              const item = value as ItemType
              for (const key in item) {
                if (!expectedKeys.includes(key)) {
                  throw new Error(`key: ${key} is not contain in item`)
                }

                if (expectedKeys.includes(key) && key === 'quantity') {
                  if (typeof item[key] !== 'number') throw new Error(`key: ${key} must be a number`)

                  if (item[key] < 1) throw new Error(`key: ${key} must be greater than 0`)
                }

                if (expectedKeys.includes(key) && key === 'item_id' && !ObjectId.isValid(item[key])) {
                  throw new Error(`key: ${key} must be a valid object identifier`)
                }
              }

              if (!item.quantity) {
                throw new Error(`item[quantity] must be not empty`)
              }

              if (!item.item_id) {
                throw new Error(`item[item_id] must be not empty`)
              }

              if (item.item_id) {
                await databaseServices.package
                  .findOne({
                    _id: new ObjectId(item.item_id),
                    status: PackageStatus.ACTIVE
                  })
                  .then((rs) => {
                    if (!rs) {
                      throw new ErrorWithStatus({
                        message: `item[item_id] = ${item.item_id} not found`,
                        status: 404
                      })
                    }
                  })
              }
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

// export const cartItemValidator = validate(
//   checkSchema(
//     {
//       items: {
//         optional: true,
//         custom: {
//           options: async (values: any) => {
//             if (!Array.isArray(values)) {
//               throw new Error('items must be an array')
//             }

//             const expectedKeys = ['quantity', 'item_id']
//             for (let i = 0; i < values.length; i++) {
//               if (typeof values[i] !== 'object') {
//                 throw new Error(`values[${i}] must be an object`)
//               }
//               const item = values[i] as ItemType
//               for (const key in item) {
//                 if (!expectedKeys.includes(key)) {
//                   throw new Error(`key: ${key} is not contain in values[${i}]`)
//                 }

//                 if (expectedKeys.includes(key) && key === 'quantity') {
//                   if (typeof item[key] !== 'number') throw new Error(`key: ${key} must be a number`)

//                   if (item[key] < 1) throw new Error(`key: ${key} must be greater than 0`)
//                 }

//                 if (expectedKeys.includes(key) && key === 'item_id' && !ObjectId.isValid(item[key])) {
//                   throw new Error(`key: ${key} must be a valid object identifier`)
//                 }
//               }

//               if (!item.quantity) {
//                 throw new Error(`items[${i}][quantity] must be not empty`)
//               }

//               if (!item.item_id) {
//                 throw new Error(`items[${i}][item_id] must be not empty`)
//               }

//               if (item.item_id) {
//                 await databaseServices.package
//                   .findOne({
//                     _id: new ObjectId(item.item_id)
//                   })
//                   .then((rs) => {
//                     if (!rs) {
//                       throw new ErrorWithStatus({
//                         message: `items[${i}][item_id] = ${item.item_id} not found`,
//                         status: 404
//                       })
//                     }
//                   })
//               }
//             }
//             return true
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )
