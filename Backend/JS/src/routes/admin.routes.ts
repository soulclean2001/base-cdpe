import express from 'express'
import adminControllers from '~/controllers/admin.controllers'
import orderControllers from '~/controllers/order.controllers'
import transactionControllers from '~/controllers/transaction.controllers'
import usersControllers from '~/controllers/users.controllers'
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
adminRouter.get('/sumany', accessTokenValidator, isAdmin, wrapAsync(adminControllers.sumany))

/*
  query: {
    month?: number,
    year?: number || (month ? now year : undefined), ,
  }

*/
adminRouter.get('/sales', accessTokenValidator, isAdmin, wrapAsync(adminControllers.sales))
/* 
  body: {
    user_id: string
  }
*/
adminRouter.post('/users/lock-or-unlock', accessTokenValidator, isAdmin, wrapAsync(usersControllers.lockOrUnlockUser))

export default adminRouter
