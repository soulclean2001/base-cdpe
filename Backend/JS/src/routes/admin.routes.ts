import express from 'express'
import adminControllers from '~/controllers/admin.controllers'
import orderControllers from '~/controllers/order.controllers'
import transactionControllers from '~/controllers/transaction.controllers'
import authController from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { accessTokenValidator, isAdmin } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const adminRouter = express.Router()

adminRouter.get('/users', accessTokenValidator, isAdmin, wrapAsync(adminControllers.getUsersFromAdmin))
adminRouter.get('/posts', accessTokenValidator, isAdmin, wrapAsync(adminControllers.getPosts))
adminRouter.get('/orders/', accessTokenValidator, isAdmin, wrapAsync(orderControllers.getAllOrdersByAdmin))
adminRouter.get('/orders/:order_id', accessTokenValidator, isAdmin, wrapAsync(orderControllers.getOrdersDetailByAdmin))
adminRouter.get(
  '/transactions/',
  accessTokenValidator,
  isAdmin,
  wrapAsync(transactionControllers.getTransactionsByAdmin)
)

export default adminRouter
