import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
import User from '../models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import Company from '~/models/schemas/Company.schema'
import UserCompanyFollow from '~/models/schemas/RecruiterFollowedResumes.schema'
import UserResumeFollow from '~/models/schemas/CompanyFollowers.schema'
import RecruiterFollowedResumes from '~/models/schemas/RecruiterFollowedResumes.schema'
import CompanyFollowers from '~/models/schemas/CompanyFollowers.schema'
import Job from '~/models/schemas/Job.schema'
import Resume from '~/models/schemas/Resume.schema'

const uri = 'mongodb+srv://soulclean2001:RNaAUT85kmchXTQR@tuyendung.6etjuzo.mongodb.net/?retryWrites=true&w=majority'
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])

    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }
  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])

    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }
  async indexVideoStatus() {
    const exists = await this.videoStatus.indexExists(['name_1'])

    if (!exists) {
      this.videoStatus.createIndex({ name: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbVideoStatusCollection)
  }

  get company(): Collection<Company> {
    return this.db.collection(envConfig.dbCompany)
  }

  get job(): Collection<Job> {
    return this.db.collection(envConfig.dbJob)
  }

  get recruiterFollowedResumes(): Collection<RecruiterFollowedResumes> {
    return this.db.collection(envConfig.dbUserCompanyFollow)
  }

  get companyFollowers(): Collection<CompanyFollowers> {
    return this.db.collection(envConfig.dbUserResumeFollow)
  }

  get resume(): Collection<Resume> {
    return this.db.collection(envConfig.dbResume)
  }
}

export default new DatabaseService()
