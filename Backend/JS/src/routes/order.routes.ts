import express from 'express'
import orderControllers from '~/controllers/order.controllers'
import { orderItemValidator } from '~/middlewares/order.middlewares'
import { accessTokenValidator, isAdmin, isEmployer } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const orderRouter = express.Router()

orderRouter.post('/', accessTokenValidator, orderItemValidator, wrapAsync(orderControllers.order))
orderRouter.get('/', accessTokenValidator, isEmployer, wrapAsync(orderControllers.getAllOrdersByCompany))
// danh sách để hiển thị banner
orderRouter.get('/list-banner', wrapAsync(orderControllers.getAllCompanyBuyBannerStillValid))
// danh sách ...
orderRouter.get('/best-jobs', wrapAsync(orderControllers.getAllJobHasCompanyBuyBannerStillValid))

// kích hoạt service đã mua thành công
orderRouter.post('/service/active', accessTokenValidator, isAdmin, wrapAsync(orderControllers.activeServiceOrder))

/*
  body: {
    order_id: string
  }
*/

orderRouter.post(
  '/active-order',
  accessTokenValidator,
  isAdmin,
  wrapAsync(orderControllers.activeServiceOrderByOrderId)
)

/*
  body: {
    order_id: string
  }
*/

orderRouter.post('/cancel-order', accessTokenValidator, isAdmin, wrapAsync(orderControllers.cancelOrderById))

orderRouter.get('/:order_id', accessTokenValidator, isEmployer, wrapAsync(orderControllers.getOrdersDetailByCompany))
orderRouter.get('/:order_id/info-payment', accessTokenValidator, isEmployer, wrapAsync(orderControllers.getInfoOrder))

export default orderRouter
