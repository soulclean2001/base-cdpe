import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { isStringNotEmpty } from './common.middlewares'
import { ObjectId } from 'mongodb'

export const sendMessageValidator = validate(
  checkSchema(
    {
      content: {
        ...isStringNotEmpty('content')
      },

      room_id: {
        ...isStringNotEmpty('room_id'),
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('room_id must be a valid identifier')
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

// content: string
//   receiver_id: string
//   room_id: string
//   sender_id: string
