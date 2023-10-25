import express from 'express'
import orderControllers from '~/controllers/order.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const orderRouter = express.Router()

orderRouter.post('/', accessTokenValidator, wrapAsync(orderControllers.order))

export default orderRouter
