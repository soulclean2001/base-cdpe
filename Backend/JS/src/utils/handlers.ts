import { Request, Response, NextFunction, RequestHandler } from 'express'

const wrapAsync =
  <P>(fn: RequestHandler<P>) =>
  (req: Request<P>, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export default wrapAsync
