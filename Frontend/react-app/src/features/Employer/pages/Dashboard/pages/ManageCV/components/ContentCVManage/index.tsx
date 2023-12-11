import { Col, Input, Row, Select, Table, Dropdown, MenuProps, Tooltip } from 'antd'
import { DatePicker } from 'antd'
import { ColumnsType, TableProps } from 'antd/es/table'
import { SorterResult } from 'antd/es/table/interface'
import { FiSearch } from 'react-icons/fi'
import { RiUserStarFill } from 'react-icons/ri'
import { BiBlock, BiCommentError, BiSolidUserX } from 'react-icons/bi'
const { RangePicker } = DatePicker
import '../../style.scss'
import { BsFillEyeFill } from 'react-icons/bs'
import { FaTrashRestoreAlt, FaUserCheck, FaUserPlus } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { ImUserCheck } from 'react-icons/im'

import { MdConnectWithoutContact, MdDelete } from 'react-icons/md'
import { format, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import apiJobsApplication, { SearchJobApplicationType } from '~/api/jobsApplication.api'
import apiCompany from '~/api/company.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CgUnblock } from 'react-icons/cg'
import { JobApplicationStatus } from '~/types/jobAppliacation.type'
import { NotifyState } from '~/components/Header/NotifyDrawer/notifySlice'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/store'
import ModalConfirm from '~/features/Admin/contents/UsersManage/components/ModalConfirm'
import { IoIosMail } from 'react-icons/io'
import ModalSendMail from '../../../../components/ModalSendMail'
interface DataType {
  id: string
  key: string
  nameJobSeeker: string
  email: string
  phoneNumber: string
  jobPosition: string
  createdTime: string
  isCVOnline: boolean
  status: string
}

// const listJob = [
//   { value: 'Tất cả công việc', label: 'Tất cả công việc' },
//   { value: '#jobId1 - job Name 1', label: '#jobId1 - job Name 1' },
//   { value: '#jobId2 - job Name 2', label: '#jobId2 - job Name 2' },
//   { value: '#jobId3 - job Name 3', label: '#jobId3 - job Name 3' }
// ]
const listStatus = [
  { value: 'allStatus', label: 'Tất tất trạng thái' },
  { value: '0', label: 'Chờ duyệt' },
  { value: '1', label: 'Chấp nhận CV' },
  { value: '2', label: 'Từ chối' },
  { value: '3', label: 'Tiềm năng' },
  { value: '4', label: 'Phỏng vấn' },
  { value: '5', label: 'Nhận việc' },
  { value: '7', label: 'Không thể liên lạc' }
]
const ContentCVManage = (props: any) => {
  const { tabKey } = props
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({})

  const navigate = useNavigate()
  // const [dataRowSelected, setDataRowSelected] = useState<DataType>()
  const [idJobAppli, setIdJobAppli] = useState<string>()
  const limit = 5
  const [pageClick, setPageClick] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  //search fillter
  const [listJobsApplied, setListJobsApplied] = useState<DataType[]>([])
  const [content, setContent] = useState('')
  const [idJob, setIdJob] = useState('')
  const [dateFormTo, setDateFormTo] = useState<string[]>([])
  const [statusApplied, setStatusApplied] = useState('')
  const [listJobs, setListJobs] = useState<{ value: string; label: any }[]>([
    { value: 'allJobs', label: 'Tất cả công việc' }
  ])
  //confirm change status profile
  const [idConfirm, setIdConfirm] = useState('')
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
  const [isBanned, setIsBanned] = useState(false)
  const [typeConfirm, setTypeConfirm] = useState('')
  const [isSubmitConfirm, setIsSubmitConfirm] = useState(false)
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false)
  const [emailWannaSend, setEmailWannaSend] = useState('')
  const [emailClicked, setEmailClicked] = useState('')
  const handleOpenModalSendMail = (email: string) => {
    setEmailWannaSend(email)
    setIsOpenModalSendMail(true)
  }
  const handleAfterSubmitConfirm = () => {
    setIsSubmitConfirm(true)
    setIsOpenModalConfirm(false)
  }
  const handleOpenModalConfirm = (id: string, type: string, isBanned: boolean) => {
    setIdConfirm(id)
    setTypeConfirm(type)
    setIsBanned(isBanned)
    setIsOpenModalConfirm(true)
  }
  useEffect(() => {
    if (isSubmitConfirm) {
      setPageClick(1)
      fetchGetJobsApplication()
      setIsSubmitConfirm(false)
    }
  }, [isSubmitConfirm])
  //
  useEffect(() => {
    fetchGetMyCompany()
  }, [])
  const fetchGetMyCompany = async () => {
    await apiCompany.getMyCompany().then(async (rs) => {
      await apiCompany.getAllJobByCompanyId(rs.result._id).then((rs) => {
        const list = rs.result.map((job: any) => {
          return { value: job._id, label: `#JOB_${job._id.slice(-5).toUpperCase()} - ${job.job_title}` }
        })

        setListJobs([...listJobs, ...list])
      })
    })
  }
  useEffect(() => {
    if (notificaions.page > 0) {
      fetchGetJobsApplication(pageClick.toString())
    }
  }, [notificaions.total])
  useEffect(() => {
    fetchGetJobsApplication()
  }, [tabKey, content, idJob, dateFormTo, statusApplied])
  const fetchGetJobsApplication = async (page?: string) => {
    let profileStatus = 'available'
    if (tabKey === 'tab-applied-cv') profileStatus = 'available'
    if (tabKey === 'tab-saved-cv') profileStatus = 'archive'
    if (tabKey === 'tab-back-list') profileStatus = 'blacklist'
    if (tabKey === 'tab-deleted') profileStatus = 'deleted'
    let request: SearchJobApplicationType = {
      limit: limit.toString(),
      page: page ? page : '1',
      content: content,
      from_date: dateFormTo ? dateFormTo[0] : '',
      to_date: dateFormTo ? dateFormTo[1] : '',
      post_id: idJob,
      status: statusApplied,
      profile_status: profileStatus
    }

    await apiJobsApplication.getJobsApplicationByFilter(request).then((rs) => {
      setTotalPage(rs.result.total)
      const listTemp: DataType[] = rs.result.jas.map((item: any) => {
        return {
          id: item._id,
          key: item._id,
          nameJobSeeker: item.full_name,
          email: item.email,
          phoneNumber: item.phone_number,
          jobPosition: `#JOB_${item.job_post_id.slice(-5).toUpperCase()}`,
          createdTime: format(parseISO(item.application_date), 'dd-MM-yyyy HH:mm:ss'),
          status: item.status.toString(),
          isCVOnline: item.type === 1 ? false : true
        }
      })
      setListJobsApplied(listTemp)
    })
  }

  const handleChangeRowTable: TableProps<DataType>['onChange'] = async (pagination, filters, sorter) => {
    console.log('log data', pagination, filters, sorter)
    setPageClick(pagination.current as number)
    setSortedInfo(sorter as SorterResult<DataType>)
    await fetchGetJobsApplication(pagination.current?.toString())
  }

  const handleClickShowDetail = (name: string, id: string) => {
    console.log(name)
    // const convertNameEng = name
    //   .normalize('NFD')
    //   .replace(/[\u0300-\u036f]/g, '')
    //   .toLowerCase()
    // const convertName = convertNameEng.replace(/\s+/g, '-').trim()

    // navigate(`/employer/dashboard/cv-manage/${convertName}-id-${id}`)
    navigate(`/employer/dashboard/cv-manage/id-${id}`)
  }
  const fetchActionApplication = async (id: string, type?: string, status?: number) => {
    if (!id) return
    if (type === 'APPROVE') {
      await apiJobsApplication.approveCV(id).then(() => {
        toast.success(`#CV_${id.slice(-5).toUpperCase()} đã được chấp nhận`)
      })
    }
    if (type === 'REJECT') {
      await apiJobsApplication.rejectCV(id).then(() => {
        toast.success(`#CV_${id.slice(-5).toUpperCase()} đã bị từ chối`)
      })
    }
    if (status && status > -1) {
      await apiJobsApplication.updateStatus(id, status).then(() => {
        toast.success(
          `#CV_${id.slice(-5).toUpperCase()} đã thay đổi trạng thái sang ${Object.values(JobApplicationStatus)[status]}`
        )
      })
    }
    await fetchGetJobsApplication(pageClick.toString())
  }
  // const handleActionChangeProfileStatus = async (id: string, profileStatus: string, statusLabel: string) => {
  //   await apiJobsApplication.updateProfileStatus(id, profileStatus).then(async () => {
  //     toast.success(`#CV_${id.slice(-5).toUpperCase()} đã thay đổi trạng thái sang ${statusLabel}`)
  //     setPageClick(1)
  //     await fetchGetJobsApplication()
  //   })
  // }
  const items: MenuProps['items'] = [
    {
      label: (
        <Tooltip title='Gửi Mail'>
          <a onClick={() => handleOpenModalSendMail(emailClicked)} style={{ color: '#1677ff' }}>
            <IoIosMail />
          </a>
        </Tooltip>
      ),
      key: '1'
    },
    {
      label: (
        <Tooltip title='Hủy bỏ'>
          <a
            // onClick={() => handleActionChangeProfileStatus(idJobAppli as string, 'deleted', 'Đã xóa')}
            onClick={() => handleOpenModalConfirm(idJobAppli as string, 'DELETED_CV', false)}
            style={{ color: '#1677ff' }}
          >
            <MdDelete />
          </a>
        </Tooltip>
      ),
      key: '2'
    },
    {
      label: (
        <Tooltip title='Thêm vào sổ đen'>
          <a
            // onClick={() => handleActionChangeProfileStatus(idJobAppli as string, 'blacklist', 'Đã chặn')}
            onClick={() => handleOpenModalConfirm(idJobAppli as string, 'BLOCKED_CV', false)}
            style={{ color: '#1677ff' }}
          >
            <BiBlock />
          </a>
        </Tooltip>
      ),
      key: '3'
    }
  ]
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên ứng viên',
      dataIndex: 'nameJobSeeker',
      key: 'nameJobSeeker',
      sorter: (a, b) => a.nameJobSeeker.localeCompare(b.nameJobSeeker),
      sortOrder: sortedInfo.columnKey === 'nameJobSeeker' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
      sortOrder: sortedInfo.columnKey === 'phoneNumber' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Vị trí ứng tuyển',
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      sorter: (a, b) => a.jobPosition.localeCompare(b.jobPosition),
      sortOrder: sortedInfo.columnKey === 'jobPosition' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },

    {
      title: 'Thời gian nộp CV',
      dataIndex: 'createdTime',
      key: 'createdTime',
      sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
      sortOrder: sortedInfo.columnKey === 'createdTime' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Trạng thái ứng tuyển',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,
      render: (text, _) => (
        <div style={{ textAlign: 'center' }}>
          {text === '0' && <span className='status-apply-job pending'>Chờ duyệt</span>}
          {text === '1' && <span className='status-apply-job approved'>Chấp nhận CV</span>}
          {text === '2' && <span className='status-apply-job rejected'>Từ chối</span>}
          {text === '3' && <span className='status-apply-job potential'>Tiềm năng</span>}
          {text === '4' && <span className='status-apply-job interview'>Phỏng vấn</span>}
          {text === '5' && <span className='status-apply-job hired'>Nhận việc</span>}
          {text === '7' && <span className='status-apply-job not-contactable'>Không thể liên hệ</span>}
        </div>
      )
    },
    {
      title: 'Xử lý',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <Tooltip title='Xem CV'>
            <a onClick={() => handleClickShowDetail(record.nameJobSeeker, record.id)}>
              <BsFillEyeFill />
            </a>
          </Tooltip>
          {tabKey === 'tab-applied-cv' && (
            <>
              {record.status === '0' && (
                <>
                  <Tooltip title='Chấp nhận CV'>
                    <a onClick={() => fetchActionApplication(record.id, 'APPROVE')}>
                      <FaUserPlus />
                    </a>
                  </Tooltip>
                  <Tooltip title='Từ chối CV'>
                    <a onClick={() => fetchActionApplication(record.id, 'REJECT')} style={{ fontSize: '19px' }}>
                      <BiSolidUserX />
                    </a>
                  </Tooltip>
                  {record.isCVOnline && (
                    <Tooltip title='Tiềm năng'>
                      <a onClick={() => fetchActionApplication(record.id, _, 3)} style={{ fontSize: '14px' }}>
                        <RiUserStarFill />
                      </a>
                    </Tooltip>
                  )}
                </>
              )}
              {record.status === '1' && (
                <>
                  <Tooltip title='Interview'>
                    <a onClick={() => fetchActionApplication(record.id, _, 4)} style={{ fontSize: '19px' }}>
                      <MdConnectWithoutContact />
                    </a>
                  </Tooltip>
                  <Tooltip title='Không thể liên hệ'>
                    <a onClick={() => fetchActionApplication(record.id, _, 7)}>
                      <BiCommentError />
                    </a>
                  </Tooltip>
                </>
              )}
              {record.status === '3' && (
                <>
                  <Tooltip title='Chấp nhận CV'>
                    <a onClick={() => fetchActionApplication(record.id, 'APPROVE')}>
                      <ImUserCheck />
                    </a>
                  </Tooltip>
                  <Tooltip title='Từ chối CV'>
                    <a onClick={() => fetchActionApplication(record.id, 'REJECT')} style={{ fontSize: '19px' }}>
                      <BiSolidUserX />
                    </a>
                  </Tooltip>
                </>
              )}
              {record.status === '4' && (
                <>
                  <Tooltip title='Nhận việc'>
                    <a onClick={() => fetchActionApplication(record.id, _, 5)}>
                      <FaUserCheck />
                    </a>
                  </Tooltip>
                  <Tooltip title='Từ chối'>
                    <a onClick={() => fetchActionApplication(record.id, 'REJECT')} style={{ fontSize: '19px' }}>
                      <BiSolidUserX />
                    </a>
                  </Tooltip>
                </>
              )}
              {record.status === '7' && (
                <>
                  <Tooltip title='Interview'>
                    <a onClick={() => fetchActionApplication(record.id, _, 4)} style={{ fontSize: '19px' }}>
                      <MdConnectWithoutContact />
                    </a>
                  </Tooltip>
                  <Tooltip title='Từ chối'>
                    <a onClick={() => fetchActionApplication(record.id, 'REJECT')} style={{ fontSize: '19px' }}>
                      <BiSolidUserX />
                    </a>
                  </Tooltip>
                </>
              )}
              {record.status !== '2' && record.status !== '5' ? (
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <FiMoreVertical />
                  </a>
                </Dropdown>
              ) : (
                <>
                  <Tooltip title='Gửi Mail'>
                    <a onClick={() => handleOpenModalSendMail(record.email)} style={{ color: '#1677ff' }}>
                      <IoIosMail />
                    </a>
                  </Tooltip>
                  <Tooltip title='Hủy bỏ'>
                    <a
                      // onClick={() => handleActionChangeProfileStatus(record.id, 'deleted', 'Hủy bỏ')}
                      onClick={() => handleOpenModalConfirm(record.id, 'DELETED_CV', false)}
                    >
                      <MdDelete />
                    </a>
                  </Tooltip>

                  <Tooltip title='Thêm vào sổ đen'>
                    <a
                      // onClick={() => handleActionChangeProfileStatus(record.id, 'blacklist', 'Đã chặn')}
                      onClick={() => handleOpenModalConfirm(record.id, 'BLOCKED_CV', false)}
                    >
                      <BiBlock />
                    </a>
                  </Tooltip>
                </>
              )}
            </>
          )}
          {tabKey === 'tab-back-list' && (
            <>
              <Tooltip title='Bỏ chặn'>
                <a
                  // onClick={() => handleActionChangeProfileStatus(record.id, 'available', 'Hiệu lực')}
                  onClick={() => handleOpenModalConfirm(record.id, 'BLOCKED_CV', true)}
                >
                  <CgUnblock />
                </a>
              </Tooltip>
            </>
          )}
          {tabKey === 'tab-deleted' && (
            <>
              <Tooltip title='Hoàn tác'>
                <a
                  // onClick={() => handleActionChangeProfileStatus(record.id, 'available', 'Hiệu lực')}
                  onClick={() => handleOpenModalConfirm(record.id, 'DELETED_CV', true)}
                  style={{ fontSize: '12px' }}
                >
                  <FaTrashRestoreAlt />
                </a>
              </Tooltip>
            </>
          )}
        </div>
      ),
      showSorterTooltip: false
    }
  ]
  return (
    <div>
      <ModalSendMail
        open={isOpenModalSendMail}
        email={emailWannaSend}
        handleCancel={() => setIsOpenModalSendMail(false)}
      />
      <ModalConfirm
        handleAfterSubmit={handleAfterSubmitConfirm}
        selectedAccountId={idConfirm}
        open={isOpenModalConfirm}
        isBanned={isBanned}
        type={typeConfirm}
        handleCancel={() => setIsOpenModalConfirm(false)}
      />
      <Row className='filter-container'>
        <Col md={8} sm={24} xs={24} style={{ padding: '5px' }}>
          <Input
            allowClear
            onChange={(e) => setContent(e.target.value)}
            size='large'
            placeholder='Tìm kiếm tên, email, số điện thoại'
            prefix={<FiSearch />}
          />
        </Col>
        <Col md={6} sm={8} xs={24} style={{ padding: '5px' }}>
          <Select
            // allowClear
            defaultValue='allJobs'
            size='large'
            style={{ width: '100%' }}
            showSearch
            onChange={(value) => setIdJob(value === 'allJobs' ? '' : value)}
            options={listJobs}
          />
        </Col>
        <Col md={5} sm={8} xs={24} style={{ padding: '5px' }}>
          <Tooltip title='Ngày nộp CV'>
            <RangePicker
              style={{ width: '100%' }}
              size='large'
              placeholder={['Từ ngày', 'Đến ngày']}
              format='YYYY-MM-DD'
              onChange={(_, valueStrings) =>
                setDateFormTo(
                  valueStrings && valueStrings[0] && valueStrings[1]
                    ? [valueStrings[0] + 'T00:00:00', valueStrings[1] + 'T23:59:59']
                    : []
                )
              }
              // locale={viVN}
            />
          </Tooltip>
        </Col>
        <Col md={4} sm={8} xs={24} style={{ padding: '5px' }}>
          <Select
            size='large'
            style={{ width: '100%' }}
            defaultValue='allStatus'
            onChange={(value) => setStatusApplied(value === 'allStatus' ? '' : value)}
            options={listStatus}
          />
        </Col>
      </Row>
      <div className='cv-applied-manage-content'>
        <div className='header-content'>
          <div className='total-cv'>{`Đã tìm thấy ${totalPage} ứng viên`}</div>
        </div>
        <div className='table-container'>
          {/* <TableApplied /> */}
          <Table
            className='table-custom'
            // style={{ maxWidth: '70vw', overflow: 'auto' }}
            scroll={{ x: true }}
            onRow={(record) => ({
              onClick: () => {
                setIdJobAppli(record.id)
                // setDataRowSelected(record)
                setEmailClicked(record.email)
              }
            })}
            columns={columns}
            dataSource={listJobsApplied}
            onChange={handleChangeRowTable}
            pagination={{ pageSize: limit, total: totalPage, current: pageClick }}
          />
        </div>
      </div>
    </div>
  )
}

export default ContentCVManage
