import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import router from './routes'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()
const port = 4000
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(compression())

databaseServices.connect()

app.use('/api/v1', router)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`server is started on port http://localhost:${port}`)
})
