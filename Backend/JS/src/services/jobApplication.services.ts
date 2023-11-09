import { ErrorWithStatus } from './../models/Errors'
import databaseServices from './database.services'
import Candidate from '~/models/schemas/Candidate.schema'
import { ObjectId } from 'mongodb'
import { ApplyReqBody } from '~/models/requests/JobApplication.request'
import JobApplication, {
  JobApplicationStatus,
  JobApplicationType,
  ApplyType,
  ProfileStatus
} from '~/models/schemas/JobApplication.schema'
import { isNumber, omit } from 'lodash'
import ConversationRoom from '~/models/schemas/ConversationRoom.schema'
import NotificationService from './notification.services'
import { NotificationObject } from '~/models/schemas/Notification.schema'
import { sendEmailJobApply } from '~/utils/email'

export interface searchJobApplication {
  content?: string
  post_id?: string
  from_date?: string
  to_date?: string
  status?: string
  profile_status?: string
  limit?: string
  page?: string
}

class JobApplicationService {
  static async apply(userId: string, payload: ApplyReqBody) {
    let temp = {}
    if (payload.cv_id) {
      const isOwnerCV = await this.isOwnerCV(userId, payload.cv_id)
      if (!isOwnerCV) {
        throw new ErrorWithStatus({
          message: 'You are not is owner of this cv',
          status: 401
        })
      }
      temp = { ...temp, cv_id: new ObjectId(payload.cv_id) }
    }
    // if (payload.application_date) {
    //   temp = { ...temp, application_date: new Date(payload.application_date) }
    // }

    if (payload.job_post_id) {
      temp = { ...temp, job_post_id: new ObjectId(payload.job_post_id) }
    }
    const _payload = { ...omit(payload, ['cv_id', 'application_date', 'job_post_id']), ...temp } as JobApplicationType
    if (_payload.type === ApplyType.CVOnline) {
      delete _payload.cv_link
    }

    const result = await databaseServices.jobApplication.insertOne(
      new JobApplication({
        ..._payload,
        user_id: new ObjectId(userId),
        status: JobApplicationStatus.Pending
      })
    )

    const job = await databaseServices.job.findOne({
      _id: _payload.job_post_id
    })
    if (job && result) {
      const company = await databaseServices.company.findOne({
        _id: job.company_id
      })

      const recievers = company?.users.map((user) => user.user_id.toString()) || []
      if (recievers.length > 0) {
        await databaseServices.conversationRooms.insertOne(
          new ConversationRoom({
            company_id: job.company_id,
            user_id: new ObjectId(userId)
          })
        )

        await NotificationService.notify({
          content: `1 ứng viên đã gửi vào bài tuyển dụng ${job?.job_title}`,
          object_recieve: NotificationObject.Employer,
          recievers,
          type: 'post/applied'
        })
      }

      const user = await databaseServices.users.findOne({
        _id: new ObjectId(userId)
      })
      const dataEmail = {
        logo_user: user?.avatar || '',
        company_logo: (company?.logo as string) || '',
        company_name: (company?.company_name as string) || '',
        job_title: job.job_title,
        salary: job.is_salary_visible ? job.salary_range.min + ' - ' + job.salary_range.max : job.pretty_salary,
        title: 'Ứng tuyển thành công!',
        type_apply: _payload.type === 0 ? 'online' : 'PDF',
        working_location: job.working_locations[0].city_name as string,
        name: payload.full_name,
        message: 'Nhà tuyển dụng sẽ đánh giá và liên hệ với bạn nhanh nhất nếu hồ sơ của bạn phù hợp.'
      }

      await sendEmailJobApply(payload.email, dataEmail)
    }

    return {
      message: 'apply job'
    }
  }

  static async isOwnerCV(userId: string, cvId: string) {
    const result = await databaseServices.resume.findOne({
      _id: new ObjectId(cvId),
      user_id: new ObjectId(userId)
    })

    return result ? true : false
  }

  static async getAllByPost(postId: string) {
    // const company = await databaseServices.company.findOne({
    //   'users.user_id': new ObjectId(userId)
    // })

    // if (!company) {
    //   throw new ErrorWithStatus({
    //     message: 'Could not find company',
    //     status: 404
    //   })
    // }

    const result = await databaseServices.jobApplication
      .find({
        job_post_id: new ObjectId(postId)
      })
      .toArray()

    return result
  }

  static async getFromCandidate(userId: string) {
    const result = await databaseServices.jobApplication
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'job_post_id',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: {
            path: '$job'
          }
        },
        {
          $project: {
            profile_status: 0,
            deleted_at: 0
          }
        }
      ])
      .toArray()

    return result
  }

  static async getById(userId: string, jobApplicationId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'No company found',
        status: 404
      })

    const jobApplication = await databaseServices.jobApplication.findOne({
      _id: new ObjectId(jobApplicationId)
    })

    if (!jobApplication) return {}

    const job = await databaseServices.job.findOne({
      _id: jobApplication.job_post_id,
      company_id: company._id
    })

    if (!job)
      throw new ErrorWithStatus({
        message: 'Job  not found',
        status: 404
      })

    const result = await databaseServices.jobApplication
      .aggregate([
        {
          $match: {
            _id: new ObjectId(jobApplicationId)
          }
        },
        {
          $lookup: {
            from: 'resumes',
            localField: 'cv_id',
            foreignField: '_id',
            as: 'cv'
          }
        },
        {
          $unwind: {
            path: '$cv',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray()

    return result[0] || {}
  }

  static async approve(jobApplicationId: string) {
    const result = await databaseServices.jobApplication.findOneAndUpdate(
      {
        _id: new ObjectId(jobApplicationId)
      },
      {
        $set: {
          status: JobApplicationStatus.Approved
        }
      },
      {
        returnDocument: 'after'
      }
    )

    if (result && result.value) {
      const job = await databaseServices.job.findOne({
        _id: result.value.job_post_id
      })

      const company = await databaseServices.company.findOne({
        _id: job?.company_id
      })

      await NotificationService.notify({
        content: `CV của bạn đã được nhà tuyển dụng '${company?.company_name}' phê duyệt`,
        object_recieve: NotificationObject.Candidate,
        recievers: [result.value.user_id.toString()],
        type: 'cv/approved'
      })

      const user = await databaseServices.users.findOne({
        _id: new ObjectId(result.value.user_id)
      })

      const dataEmail = {
        logo_user: user?.avatar || '',
        company_logo: (company?.logo as string) || '',
        company_name: (company?.company_name as string) || '',
        job_title: job?.job_title || '',
        salary: job?.is_salary_visible
          ? job.salary_range.min + ' - ' + job.salary_range.max
          : job?.pretty_salary || 'Thương lượng',
        title: 'Ứng tuyển thành công!',
        type_apply: result.value.type === 0 ? 'online' : 'PDF',
        working_location: (job?.working_locations[0].city_name as string) || '',
        name: result.value.full_name,
        message:
          'Nhà tuyển dụng sẽ liên hệ với bạn nhanh nhất có thể vui lòng kiểm tra email hoặc điện thoại để được nhận thông báo.'
      }

      await sendEmailJobApply(result.value.email, dataEmail)
    }

    return {
      message: result.ok ? 'Action Approve OK' : 'Action Approve Failed'
    }
  }

  static async reject(jobApplicationId: string) {
    const result = await databaseServices.jobApplication.findOneAndUpdate(
      {
        _id: new ObjectId(jobApplicationId)
      },
      {
        $set: {
          status: JobApplicationStatus.Rejected
        }
      },
      {
        returnDocument: 'after'
      }
    )

    // if (result && result.value) {
    //   const job = await databaseServices.job.findOne({
    //     _id: result.value.job_post_id
    //   })

    //   const company = await databaseServices.company.findOne({
    //     _id: job?.company_id
    //   })

    //   await NotificationService.notify({
    //     content: `CV của bạn đã được nhà tuyển dụng '${company?.company_name}' từ chối`,
    //     object_recieve: NotificationObject.Candidate,
    //     recievers: [result.value.user_id.toString()],
    //     type: 'cv/rejected'
    //   })
    // }

    return {
      message: result.ok ? 'Action Reject OK' : 'Action Reject Failed'
    }
  }

  static async updateStatus(userId: string, jobApplicationId: string, status: JobApplicationStatus) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'No company found',
        status: 404
      })

    const jobApplication = await databaseServices.jobApplication.findOne({
      _id: new ObjectId(jobApplicationId)
    })

    if (!jobApplication)
      throw new ErrorWithStatus({
        message: 'Job application not found',
        status: 404
      })

    const job = await databaseServices.job.findOne({
      _id: jobApplication.job_post_id,
      company_id: company._id
    })

    if (!job)
      throw new ErrorWithStatus({
        message: 'Job  not found',
        status: 404
      })

    const result = await databaseServices.jobApplication.findOneAndUpdate(
      {
        _id: new ObjectId(jobApplicationId)
      },
      {
        $set: {
          status: status
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    if (result && result.value) {
      const job = await databaseServices.job.findOne({
        _id: result.value.job_post_id
      })

      const company = await databaseServices.company.findOne({
        _id: job?.company_id
      })

      const msg = this.getMessageStatus(status, company?.company_name as string)
      if (status === JobApplicationStatus.Approved || status === JobApplicationStatus.Potential)
        await NotificationService.notify({
          content: msg?.content as string,
          object_recieve: NotificationObject.Candidate,
          recievers: [result.value.user_id.toString()],
          type: msg?.type as string
        })
    }

    return {
      message: result ? `Update status: '${status}' OK` : `Update status: '${status}' Failed`
    }
  }

  static getMessageStatus(status: JobApplicationStatus, companyName: string) {
    const msg = `CV của bạn đã được nhà tuyển dụng ${companyName}`
    const t = 'cv/'
    switch (status) {
      case JobApplicationStatus.Approved: {
        return {
          content: msg + ' phê duyệt',
          type: t + 'approved'
        }
      }

      case JobApplicationStatus.Potential: {
        return {
          content: msg + ' đưa vào hồ sơ có tiềm năng',
          type: t + 'potential'
        }
      }
    }
  }

  static async getJobAppications(userId: string, filter: searchJobApplication) {
    //
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: "Could not find company's job applications",
        status: 404
      })
    }

    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const opts = JobApplicationService.convertToOptions(filter) || {}

    console.log(opts)

    const [jas, total] = await Promise.all([
      databaseServices.jobApplication
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $lookup: {
              from: 'jobs',
              localField: 'job_post_id',
              foreignField: '_id',
              as: 'job'
            }
          },
          {
            $unwind: {
              path: '$job'
            }
          },
          {
            $match: {
              'job.company_id': company._id
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.jobApplication
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $lookup: {
              from: 'jobs',
              localField: 'job_post_id',
              foreignField: '_id',
              as: 'job'
            }
          },
          {
            $unwind: {
              path: '$job'
            }
          },
          {
            $match: {
              'job.company_id': company._id
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      jas,
      limit,
      page,
      total: total[0]?.total || 0
    }
  }

  static convertToOptions(filter: searchJobApplication) {
    const options: {
      [key: string]: any
    } = {}
    const content = filter.content?.trim() || ''
    if (content) {
      options['$text'] = {
        $search: content
      }
    }

    if (filter.status && isNumber(Number(filter.status))) {
      options['status'] = Number(filter.status)
    }

    if (filter.profile_status) {
      options['profile_status'] = filter.profile_status
    }

    if (filter.from_date) {
      options['created_at'] = {
        $gte: new Date(filter.from_date)
      }
    }

    if (filter.to_date) {
      if (filter.from_date) {
        options['created_at'] = {
          $gte: new Date(filter.from_date),
          $lte: new Date(filter.to_date)
        }
      } else {
        options['created_at'] = {
          $lte: new Date(filter.to_date)
        }
      }
    }

    if (filter.post_id && ObjectId.isValid(filter.post_id)) {
      options['job_post_id'] = new ObjectId(filter.post_id)
    }

    return options
  }

  static async getInfoJobsAppliedByUserId(userId: string) {
    const result = await databaseServices.jobApplication
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'job_post_id',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: {
            path: '$job'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $addFields: {
            info_job: {
              job_title: '$job.job_title',
              _id: '$job._id'
            },
            info_company: {
              company_name: '$job.company.company_name',
              avatar: '$job.company.logo',
              _id: '$job.company_id'
            },
            info_user: {
              company_name: '$user.name',
              avatar: '$user.avatar',
              _id: '$user._id'
            }
          }
        },
        {
          $project: {
            user: 0,
            job: 0
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ])
      .toArray()

    return result
  }

  static async getInfoJobsAppliedByCompany(userId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'Company not found',
        status: 404
      })

    const result = await databaseServices.jobApplication
      .aggregate([
        {
          $lookup: {
            from: 'jobs',
            localField: 'job_post_id',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: {
            path: '$job'
          }
        },
        {
          $match: {
            'job.company_id': company._id
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $addFields: {
            info_job: {
              job_title: '$job.job_title',
              _id: '$job._id'
            },
            info_company: {
              company_name: '$job.company.company_name',
              avatar: '$job.company.logo',
              _id: '$job.company_id'
            },
            info_user: {
              company_name: '$user.name',
              avatar: '$user.avatar',
              _id: '$user._id'
            }
          }
        },
        {
          $project: {
            user: 0,
            job: 0
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ])
      .toArray()

    return result
  }

  static async checkIsApplied(userId: string, postId: string) {
    const jobApplication = await databaseServices.jobApplication.findOne({
      job_post_id: new ObjectId(postId),
      user_id: new ObjectId(userId)
    })

    return {
      is_applied: jobApplication ? true : false
    }
  }

  static async updateProfileStatus(userId: string, jobApplicationId: string, status: ProfileStatus) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company)
      throw new ErrorWithStatus({
        message: 'No company found',
        status: 404
      })

    const jobApplication = await databaseServices.jobApplication.findOne({
      _id: new ObjectId(jobApplicationId)
    })

    if (!jobApplication)
      throw new ErrorWithStatus({
        message: 'Job application not found',
        status: 404
      })

    const job = await databaseServices.job.findOne({
      _id: jobApplication.job_post_id,
      company_id: company._id
    })

    if (!job)
      throw new ErrorWithStatus({
        message: 'Job  not found',
        status: 404
      })

    const updateDeletedAt: {
      deleted_at: undefined | Date
    } = {
      deleted_at: undefined
    }

    if (status === ProfileStatus.Deleted) {
      updateDeletedAt.deleted_at = new Date()
    }

    const result = await databaseServices.jobApplication.findOneAndUpdate(
      {
        _id: new ObjectId(jobApplicationId)
      },
      {
        $set: {
          profile_status: status,
          deleted_at: updateDeletedAt.deleted_at
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return {
      message: result ? `Update profile status: '${status}' OK` : `Update profile status: '${status}' Failed`
    }
  }
}

export default JobApplicationService
