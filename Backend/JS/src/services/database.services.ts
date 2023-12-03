import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
import User from '../models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Company from '~/models/schemas/Company.schema'
import UserCompanyFollow from '~/models/schemas/RecruiterFollowedResumes.schema'
import UserResumeFollow from '~/models/schemas/CompanyFollowers.schema'
import RecruiterFollowedResumes from '~/models/schemas/RecruiterFollowedResumes.schema'
import CompanyFollowers from '~/models/schemas/CompanyFollowers.schema'
import Job from '~/models/schemas/Job.schema'
import Resume from '~/models/schemas/Resume.schema'
import Package from '~/models/schemas/Package.schema'
import Cart, { CartItem } from '~/models/schemas/Cart.schema'
import Conversation from '~/models/schemas/Conversation.schema'
import Candidate from '~/models/schemas/Candidate.schema'
import PotentialCandidate from '~/models/schemas/PotentialCandidate.schema'
import TrackedCandidate from '~/models/schemas/TrackedCandidate.schema'
import JobApplication from '~/models/schemas/JobApplication.schema'
import PurchasedPackage from '~/models/schemas/PurchasedPackage.schema'
import ConversationRoom from '~/models/schemas/ConversationRoom.schema'
import { text } from 'body-parser'
import Order from '~/models/schemas/Order.schema'
import ServiceOrder from '~/models/schemas/ServiceOrder.schema'
import TransactionHistory from '~/models/schemas/TransactionHistory.schema'
import Notification from '~/models/schemas/Notification.schema'

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
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1', 'email_text_name_text'])

    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
      this.users.createIndex({ email: 'text', name: 'text' })
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

  async indexCandidate() {
    const exists = await this.candidate.indexExists(['cv_id_1'])

    if (!exists) {
      this.candidate.createIndex({ cv_id: 1 })
    }
  }

  async indexJobs() {
    const exists = await this.job.indexExists([
      'company_id_1',
      'job_title_text_company.company_name_text_job_level_text'
    ])

    if (!exists) {
      this.job.createIndex({ company_id: 1 })
      this.job.createIndex({
        job_title: 'text',
        'company.company_name': 'text',
        job_level: 'text'
      })
    }
  }

  async indexJobApplications() {
    const exists = await this.jobApplication.indexExists(['full_name_text_email_text_phone_number_text'])
    if (!exists) {
      this.jobApplication.createIndex({
        full_name: 'text',
        phone_number: 'text',
        email: 'text'
      })
    }
  }

  async indexCompany() {
    // const exists = await this.job.indexExists(['company_name_text'])
    // if (!exists) {
    //   this.job.createIndex({
    //     company_name: 'text'
    //   })
    // }
  }

  // async indexVideoStatus() {
  //   const exists = await this.videoStatus.indexExists(['name_1'])

  //   if (!exists) {
  //     this.videoStatus.createIndex({ name: 1 })
  //   }
  // }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get company(): Collection<Company> {
    return this.db.collection(envConfig.dbCompany)
  }

  get job(): Collection<Job> {
    return this.db.collection(envConfig.dbJob)
  }

  get recruiterFollowedResumes(): Collection<RecruiterFollowedResumes> {
    return this.db.collection(envConfig.dbCompanyResumeFollow)
  }

  get companyFollowers(): Collection<CompanyFollowers> {
    return this.db.collection(envConfig.dbUserCompanyFollow)
  }

  get resume(): Collection<Resume> {
    return this.db.collection(envConfig.dbResume)
  }

  get package(): Collection<Package> {
    return this.db.collection(envConfig.dbPackage)
  }

  get cart(): Collection<Cart> {
    return this.db.collection(envConfig.dbCart)
  }

  get cartItem(): Collection<CartItem> {
    return this.db.collection(envConfig.dbCartItem)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(envConfig.dbConversationCollection)
  }

  get conversationRooms(): Collection<ConversationRoom> {
    return this.db.collection(envConfig.dbConversationRoomsCollection)
  }

  get candidate(): Collection<Candidate> {
    return this.db.collection(envConfig.dbCandidate)
  }

  get trackedCandidate(): Collection<TrackedCandidate> {
    return this.db.collection(envConfig.dbTrackedCandidate)
  }

  get jobApplication(): Collection<JobApplication> {
    return this.db.collection(envConfig.dbJobApplication)
  }

  get purchasedPackage(): Collection<PurchasedPackage> {
    return this.db.collection(envConfig.dbPurchasedPackage)
  }

  get order(): Collection<Order> {
    return this.db.collection(envConfig.dbOrder)
  }

  get serviceOrder(): Collection<ServiceOrder> {
    return this.db.collection(envConfig.dbServiceOrder)
  }

  get transaction(): Collection<TransactionHistory> {
    return this.db.collection(envConfig.dbTransactionHistory)
  }

  get notification(): Collection<Notification> {
    return this.db.collection(envConfig.dbNotificationCollection)
  }
}

export default new DatabaseService()
