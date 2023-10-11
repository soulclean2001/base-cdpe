import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
const env = process.env.NODE_ENV || 'development'
// const envFilename = `.env.${env}`
const envFilename = `.env`
if (!env) {
  console.log(`Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`)
  console.log(`Phát hiện NODE_ENV = ${env}`)
  process.exit(1)
}
console.log(`Phát hiện NODE_ENV = ${env}, vì thế app sẽ dùng file môi trường là ${envFilename}`)
if (!fs.existsSync(path.resolve(envFilename))) {
  console.log(`Không tìm thấy file môi trường ${envFilename}`)
  console.log(`Lưu ý: App không dùng file .env, ví dụ môi trường là development thì app sẽ dùng file .env.development`)
  console.log(`Vui lòng tạo file ${envFilename} và tham khảo nội dung ở file .env.example`)
  process.exit(1)
}
config({
  path: envFilename
})
export const isProduction = env === 'production'

const toSecond = (input: string) => {
  const result = input.match(/^(\d+)([a-zA-Z]+)$/)
  let time = 0
  if (result) {
    const numberPart = result[1] // Số
    const characterPart = result[2] // Ký tự

    switch (characterPart) {
      case 'h': {
        time = parseInt(numberPart) * 3600
        break
      }

      case 'd': {
        time = parseInt(numberPart) * 3600 * 24
        break
      }
      case 'm': {
        time = parseInt(numberPart) * 60
        break
      }
      case 's': {
        time = parseInt(numberPart)
        break
      }
    }
  }

  return time
}

export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  host: process.env.HOST as string,
  dbName: process.env.DB_NAME as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
  dbCompany: process.env.DB_COMPANY_COLLECTION as string,
  dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION as string,
  dbUserCompanyFollow: process.env.DB_USER_COMPANY_FOLLOW_COLLECTION as string,
  dbCompanyResumeFollow: process.env.DB_COMPANY_RESUME_FOLLOW_COLLECTION as string,
  dbJob: process.env.DB_JOB_COLLECTION as string,
  dbResume: process.env.DB_RESUME_COLLECTION as string,
  dbPackage: process.env.DB_PACKAGE_COLLECTION as string,
  dbCart: process.env.DB_CART_COLLECTION as string,
  dbCartItem: process.env.DB_CART_ITEM_COLLECTION as string,
  dbConversationCollection: process.env.DB_CONVERSATION_COLLECTION as string,
  dbConversationRoomsCollection: process.env.DB_CONVERSATION_ROOMS_COLLECTION as string,
  dbTrackedCandidate: process.env.DB_TRACKED_CANDIDATES_COLLECTION as string,
  dbJobApplication: process.env.DB_JOB_APPLICATION_COLLECTION as string,
  dbCandidate: process.env.DB_CANDIDATE_COLLECTION as string,
  dbPurchasedPackage: process.env.DB_PURCHASED_PACKAGE_COLLECTION as string,
  redisPassword: process.env.REDIS_PASSWORD as string,
  redisHost: process.env.REDIS_HOST as string,
  redisPort: process.env.REDIS_PORT as string,
  passwordSecret: process.env.PASSWORD_SECRET as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  refreshTokenSecondExpiresIn: toSecond(process.env.REFRESH_TOKEN_EXPIRES_IN as string),
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI as string,
  clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string,
  clientUrl: process.env.VERIFY_CLIENT_URL as string,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  awsRegion: process.env.AWS_REGION as string,
  sesFromAddress: process.env.SES_FROM_ADDRESS as string,
  s3BucketName: process.env.S3_BUCKET_NAME as string,
  dbVideoStatusCollection: process.env.DB_VIDEO_STATUS_COLLECTION as string
}
