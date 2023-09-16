import { CreatePackageReqBody, UpdatePackageReqBody } from '~/models/requests/Package.request'
import databaseServices from './database.services'
import Package, { PackageStatus } from '~/models/schemas/Package.schema'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { deleteFileFromS3 } from '~/utils/s3'

export default class PackageService {
  static async createPackage(data: CreatePackageReqBody) {
    const pkg = await databaseServices.package.insertOne(
      new Package({
        ...data
      })
    )

    return pkg
  }

  static async updatePackage(package_id: string, data: UpdatePackageReqBody) {
    const oldPkg = await databaseServices.package.findOne({
      _id: new ObjectId(package_id)
    })
    const pkg = await databaseServices.package.findOneAndUpdate(
      {
        _id: new ObjectId(package_id)
      },
      {
        $set: {
          ...data,
          status: PackageStatus.ARCHIVE
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }

    const oldUrls = []
    if (oldPkg && oldPkg.preview && data.preview !== undefined) {
      const convertToS3Url = oldPkg.preview.match(/images\/.*/)
      if (convertToS3Url && convertToS3Url.length > 0) oldUrls.push(convertToS3Url[0])
    }
    if (oldUrls.length === 1) await deleteFileFromS3(oldUrls[0])

    return pkg.value
  }

  static async deletePackage(package_id: string) {
    const pkg = await databaseServices.package.findOneAndUpdate(
      {
        _id: new ObjectId(package_id)
      },
      {
        $set: {
          status: PackageStatus.DELETED
        },
        $currentDate: {
          deleted_at: true,
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg.value
  }

  static async removePackage(package_id: string) {
    const pkg = await databaseServices.package.findOneAndDelete({
      _id: new ObjectId(package_id)
    })
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg.value
  }

  static async getPackage(package_id: string) {
    const pkg = await databaseServices.package.findOne({
      _id: new ObjectId(package_id)
    })
    if (!pkg) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg
  }

  static async getAllPackages() {
    const pkg = await databaseServices.package.find({}).toArray()

    return pkg
  }

  static async activePackage(package_id: string) {
    const pkg = await databaseServices.package.findOneAndUpdate(
      {
        _id: new ObjectId(package_id)
      },
      {
        $set: {
          status: PackageStatus.ACTIVE
        },
        $currentDate: {
          deleted_at: true,
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    if (!pkg.value) {
      throw new ErrorWithStatus({
        message: 'Package not found',
        status: 404
      })
    }
    return pkg.value
  }
}
