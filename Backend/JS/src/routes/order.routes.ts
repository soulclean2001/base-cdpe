import express from 'express'
import orderControllers from '~/controllers/order.controllers'
import { orderItemValidator } from '~/middlewares/order.middlewares'
import { accessTokenValidator, isEmployer } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const orderRouter = express.Router()

orderRouter.post('/', accessTokenValidator, orderItemValidator, wrapAsync(orderControllers.order))
orderRouter.get('/', accessTokenValidator, isEmployer, wrapAsync(orderControllers.getAllOrdersByCompany))
// danh sách để hiển thị banner
orderRouter.get('/list-banner', wrapAsync(orderControllers.getAllCompanyBuyBannerStillValid))
// danh sách ...
orderRouter.get('/best-jobs', wrapAsync(orderControllers.getAllJobHasCompanyBuyBannerStillValid))

// kích hoạt service đã mua thành công
orderRouter.get(
  '/active-order/:service_id',
  accessTokenValidator,
  isEmployer,
  wrapAsync(orderControllers.activeServiceOrder)
)
orderRouter.get('/:order_id', accessTokenValidator, isEmployer, wrapAsync(orderControllers.getOrdersDetailByCompany))

export default orderRouter
