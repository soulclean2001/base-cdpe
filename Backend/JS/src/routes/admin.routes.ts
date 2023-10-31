import express from 'express'
import adminControllers from '~/controllers/admin.controllers'
import orderControllers from '~/controllers/order.controllers'
import transactionControllers from '~/controllers/transaction.controllers'
import authController from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { accessTokenValidator, isAdmin } from '~/middlewares/users.middlewares'

const adminRouter = express.Router()

adminRouter.get('/users', accessTokenValidator, isAdmin, adminControllers.getUsersFromAdmin)
adminRouter.get('/posts', accessTokenValidator, isAdmin, adminControllers.getPosts)
adminRouter.get('/orders/', accessTokenValidator, isAdmin, orderControllers.getAllOrdersByAdmin)
adminRouter.get('/orders/:order_id', accessTokenValidator, isAdmin, orderControllers.getOrdersDetailByAdmin)
adminRouter.get('/transactions/', accessTokenValidator, isAdmin, transactionControllers.getTransactionsByAdmin)

export default adminRouter
