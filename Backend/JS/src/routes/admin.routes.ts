import express from 'express'
import adminControllers from '~/controllers/admin.controllers'
import authController from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'

const adminRouter = express.Router()

adminRouter.get('/users', adminControllers.getUsersFromAdmin)
adminRouter.get('/posts', adminControllers.getPosts)

export default adminRouter
