import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.request'
import TransactionService from '~/services/transaction.services'

class TransactionController {
  async getTransactionsByCompany(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { role, user_id } = req.decoded_authorization as TokenPayload

    const result = await TransactionService.getTransactionsByCompany(user_id, req.query)

    return res.json({
      message: 'Transaction by company',
      result
    })
  }

  async getTransactionsByAdmin(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { role, user_id } = req.decoded_authorization as TokenPayload

    const result = await TransactionService.getTransactionsByAdmin(req.query)

    return res.json({
      message: 'Transaction by administrator',
      result
    })
  }
}

export default new TransactionController()
