import express from 'express'
import usersRouter from './users.routes'
import mediasRouter from './medias.routes'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/medias', mediasRouter)

export default router
