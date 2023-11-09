import { accessTokenValidator, isAdmin, isEmployer } from './../middlewares/users.middlewares'
import { Router } from 'express'
import packageControllers from '~/controllers/package.controllers'
import {
  createPackageValidator,
  packageQueryMiddleware,
  updatePackageValidator
} from '~/middlewares/package.middlewares'
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
packageRouter.post('/:package_id', accessTokenValidator, isAdmin, wrapAsync(packageControllers.deletePackage))
packageRouter.delete('/:package_id', accessTokenValidator, isAdmin, wrapAsync(packageControllers.removePackage))
// active package
packageRouter.post('/:package_id/active', accessTokenValidator, isAdmin, wrapAsync(packageControllers.activePackage))
// GET ALL BY ADMIN
packageRouter.get('/', accessTokenValidator, isAdmin, wrapAsync(packageControllers.getAllPackages))

// GET ALL BY EMPLOYER
packageRouter.get(
  '/get-by-filter',
  accessTokenValidator,
  isEmployer,
  wrapAsync(packageControllers.getAllPackagesByTitle)
)
// package employer sở hữu
packageRouter.get('/me', accessTokenValidator, isEmployer, wrapAsync(packageControllers.getAllPackagesOwn))
packageRouter.get(
  '/:package_id',
  accessTokenValidator,
  packageQueryMiddleware,
  wrapAsync(packageControllers.getPackage)
)

export default packageRouter
