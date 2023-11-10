import { CreatePackageReqBody, UpdatePackageReqBody } from '~/models/requests/Package.request'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import PackageService from '~/services/package.services'
import { TokenPayload } from '~/models/requests/User.request'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'

class PackageController {
  async createPackage(req: Request<ParamsDictionary, any, CreatePackageReqBody>, res: Response) {
    const { body } = req
    const result = await PackageService.createPackage(body)
    return res.json({
      message: 'Package created successfully',
      result
    })
  }

  async updatePackage(req: Request<ParamsDictionary, any, UpdatePackageReqBody>, res: Response) {
    const { package_id } = req.params
    const { body } = req
    const result = await PackageService.updatePackage(package_id, body)
    return res.json({
      message: 'Package updated successfully',
      result
    })
  }

  async deletePackage(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { package_id } = req.params
    if (!ObjectId.isValid(package_id)) {
      throw new ErrorWithStatus({
        message: 'Package id must be a valid',
        status: 422
      })
    }

    const result = await PackageService.deletePackage(package_id)
    return res.json({
      message: 'Package deleted successfully',
      result
    })
  }

  async archivePackage(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { package_id } = req.params

    if (!ObjectId.isValid(package_id)) {
      throw new ErrorWithStatus({
        message: 'Package id must be a valid',
        status: 422
      })
    }
    const result = await PackageService.archivePackage(package_id)
    return res.json({
      message: 'Package archived successfully',
      result
    })
  }

  async removePackage(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { package_id } = req.params
    if (!ObjectId.isValid(package_id)) {
      throw new ErrorWithStatus({
        message: 'Package id must be a valid',
        status: 422
      })
    }

    const result = await PackageService.removePackage(package_id)
    return res.json({
      message: 'Package removed successfully',
      result
    })
  }

  async activePackage(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { package_id } = req.params
    if (!ObjectId.isValid(package_id)) {
      throw new ErrorWithStatus({
        message: 'Package id must be a valid',
        status: 422
      })
    }

    const result = await PackageService.activePackage(package_id)
    return res.json({
      message: 'Package actived successfully',
      result
    })
  }

  async getPackage(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { package_id } = req.params

    const result = await PackageService.getPackage(package_id)
    return res.json({
      message: 'Get package',
      result
    })
  }

  async getAllPackages(req: Request<ParamsDictionary, any, any>, res: Response) {
    console.log(req.query)

    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    const result = await PackageService.getAllPackagesByAdmin(limit, page, req.query)
    return res.json({
      message: 'Get all package',
      result
    })
  }

  async getAllPackagesByTitle(req: Request<ParamsDictionary, any, any>, res: Response) {
    console.log(req.query)

    const limit = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1
    const result = await PackageService.getAllPackagesByTitle(limit, page, req.query)
    return res.json({
      message: 'Get all package',
      result
    })
  }

  async getAllPackagesOwn(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload

    const result = await PackageService.getAllPackagesOwn(user_id, req.query)

    return res.json({
      message: 'Package owned by company',
      result
    })
  }
}

export default new PackageController()
