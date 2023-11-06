import { Router } from 'express'
import cartControllers from '~/controllers/cart.controllers'
import { cartItemValidator } from '~/middlewares/cart.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const cartRouter = Router()
cartRouter.post('/', accessTokenValidator, wrapAsync(cartControllers.getCart))
cartRouter.post('/items/', accessTokenValidator, cartItemValidator, wrapAsync(cartControllers.addOrUpdateItem))
cartRouter.delete('/items/:item_id', accessTokenValidator, wrapAsync(cartControllers.deleteItem))
cartRouter.get('/items/:item_id', accessTokenValidator, wrapAsync(cartControllers.getItem))
cartRouter.get('/items/', accessTokenValidator, wrapAsync(cartControllers.getAllItem))
export default cartRouter
