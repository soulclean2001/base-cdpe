import express from 'express'
import orderControllers from '~/controllers/order.controllers'
import { orderItemValidator } from '~/middlewares/order.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const orderRouter = express.Router()

orderRouter.post('/', accessTokenValidator, orderItemValidator, wrapAsync(orderControllers.order))

export default orderRouter
