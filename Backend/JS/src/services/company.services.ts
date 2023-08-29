import { PositionType, UpdateCompanyReqBody } from '~/models/requests/Company.request'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'

class CompanyService {
  static async updateCompany(userId: string, payload: UpdateCompanyReqBody, companyId: string) {
    const rs = await databaseServices.company.findOneAndUpdate(
      {
        _id: new ObjectId(companyId),
        users: [
          {
            user_id: new ObjectId(userId),
            position: PositionType.Admin
          }
        ]
      },
      {
        $set: {
          ...payload
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return rs.value
  }
}

export default CompanyService
