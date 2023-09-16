import { CreatePackageReqBody, UpdatePackageReqBody } from '~/models/requests/Package.request'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import PackageService from '~/services/package.services'

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
    const result = await PackageService.deletePackage(package_id)
    return res.json({
      message: 'Package deleted successfully',
      result
    })
  }

  async removePackage(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { package_id } = req.params
    const result = await PackageService.removePackage(package_id)
    return res.json({
      message: 'Package removed successfully',
      result
    })
  }

  async activePackage(req: Request<ParamsDictionary, any, any>, res: Response) {
    const { package_id } = req.params
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
    const result = await PackageService.getAllPackages()
    return res.json({
      message: 'Get all package',
      result
    })
  }
}

export default new PackageController()
