import { accessTokenValidator, isAdmin } from './../middlewares/users.middlewares'
import { Router } from 'express'
import packageControllers from '~/controllers/package.controllers'
import { createPackageValidator, updatePackageValidator } from '~/middlewares/package.middlewares'
import wrapAsync from '~/utils/handlers'

const packageRouter = Router()

packageRouter.post(
  '/',
  accessTokenValidator,
  isAdmin,
  createPackageValidator,
  wrapAsync(packageControllers.createPackage)
)
packageRouter.patch(
  '/:package_id',
  accessTokenValidator,
  isAdmin,
  updatePackageValidator,
  wrapAsync(packageControllers.updatePackage)
)
packageRouter.post('/:package_id', isAdmin, wrapAsync(packageControllers.deletePackage))
packageRouter.delete('/:package_id', isAdmin, wrapAsync(packageControllers.removePackage))
packageRouter.post('/:package_id/active', isAdmin, wrapAsync(packageControllers.activePackage))
packageRouter.get('/:package_id', wrapAsync(packageControllers.getPackage))
packageRouter.get('/', wrapAsync(packageControllers.getAllPackages))

export default packageRouter
