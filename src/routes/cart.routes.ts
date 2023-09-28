import { Router } from 'express'
import cartControllers from '~/controllers/cart.controllers'
import { cartItemValidator } from '~/middlewares/cart.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const cartRouter = Router()
cartRouter.post('/', accessTokenValidator, cartControllers.getCart)
cartRouter.post('/items/', accessTokenValidator, cartItemValidator, cartControllers.addOrUpdateItem)
cartRouter.delete('/items/:item_id', accessTokenValidator, cartControllers.deleteItem)
cartRouter.get('/items/:item_id', accessTokenValidator, cartControllers.getItem)
cartRouter.get('/items/', accessTokenValidator, cartControllers.getAllItem)
export default cartRouter
