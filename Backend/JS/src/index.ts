import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import cors, { CorsOptions } from 'cors'
import router from './routes'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import { initFolder } from './utils/file'
import rateLimit from 'express-rate-limit'
import { envConfig, isProduction } from '~/constants/config'
import http from 'http'
import { Server } from 'socket.io'
import socket from './app/socket'
import { redis } from './app/redis'

initFolder()

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

databaseServices.connect().then(() => {
  databaseServices.indexUsers()
  databaseServices.indexRefreshTokens()
  //databaseServices.indexVideoStatus()
  databaseServices.indexCompany()
  databaseServices.indexJobs()
  databaseServices.indexJobApplications()
})
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
// app.use(limiter)

// const httpServer = createServer(app)
// isProduction ? envConfig.clientUrl :
app.use(helmet())
const corsOptions: CorsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

socket(io)
redis.client.connect()

app.use('/api/v1', router)

app.use(defaultErrorHandler)

httpServer.listen(port, () => {
  console.log(`server is started on port http://localhost:${port}`)
})
