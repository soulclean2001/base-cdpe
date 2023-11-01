import { Col, Input, Row, Select, Table, Dropdown, MenuProps, Tooltip, Modal } from 'antd'
import { DatePicker } from 'antd'
import { ColumnsType, TableProps } from 'antd/es/table'
import { SorterResult } from 'antd/es/table/interface'
import { FiSearch } from 'react-icons/fi'

import { BiBlock, BiCommentError, BiSolidUserX } from 'react-icons/bi'
const { RangePicker } = DatePicker
import '../../style.scss'
import { BsFillEyeFill } from 'react-icons/bs'
import { FaUserCheck } from 'react-icons/fa'
import { FiMoreVertical } from 'react-icons/fi'
import { ImUserCheck } from 'react-icons/im'
import { IoMdMail } from 'react-icons/io'
import { MdConnectWithoutContact, MdDelete } from 'react-icons/md'
import { format, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import apiJobsApplication, { SearchJobApplicationType } from '~/api/jobsApplication.api'
import apiCompany from '~/api/company.api'
import { toast } from 'react-toastify'
interface DataType {
  id: string
  key: string
  nameJobSeeker: string
  email: string
  phoneNumber: string
  jobPosition: string
  createdTime: string
  // reviewTime: string | undefined
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
  { value: '6', label: 'Không thể liên lạc' }
]
const ContentCVManage = (props: any) => {
  const { tabKey } = props
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({})
  const [openModalInfo, setOpenModalInfo] = useState(false)

  const [dataRowSelected, setDataRowSelected] = useState<DataType>()
  const [idPost, setIdPost] = useState<string>()
  const limit = 2
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
        console.log('list job', [...listJobs, ...list])
        setListJobs([...listJobs, ...list])
      })
    })
  }
  useEffect(() => {
    fetchGetJobsApplication()
  }, [tabKey, content, idJob, dateFormTo, statusApplied])
  const fetchGetJobsApplication = async (page?: string) => {
    let profileStatus = ''
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
      console.log('rs', rs)
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
          status: item.status.toString()
        }
      })
      setListJobsApplied(listTemp)
    })
  }
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  const handleChangeRowTable: TableProps<DataType>['onChange'] = async (pagination, filters, sorter) => {
    console.log('log data', pagination, filters, sorter)
    setSortedInfo(sorter as SorterResult<DataType>)
    await fetchGetJobsApplication(pagination.current?.toString())
  }
  useEffect(() => {
    console.log('data row selected', dataRowSelected)
  }, [dataRowSelected])
  const handleCloseModalInfo = () => {
    setOpenModalInfo(false)
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <Tooltip title='Gửi Mail'>
          <a style={{ color: '#1677ff' }}>
            <IoMdMail />
          </a>
        </Tooltip>
      ),
      key: '0'
    },
    // {
    //   label: (
    //     <Tooltip title='In CV'>
    //       <a style={{ color: '#1677ff' }}>
    //         <AiFillPrinter />
    //       </a>
    //     </Tooltip>
    //   ),
    //   key: '1'
    // },
    {
      label: (
        <Tooltip title='Hủy bỏ'>
          <a style={{ color: '#1677ff' }}>
            <MdDelete />
          </a>
        </Tooltip>
      ),
      key: '2'
    },
    {
      label: (
        <Tooltip title='Thêm vào sổ đen'>
          <a style={{ color: '#1677ff' }}>
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
    // {
    //   title: 'Thời gian xem xét',
    //   dataIndex: 'reviewTime',
    //   key: 'reviewTime',
    //   //   sorter: (a, b) => a.reviewTime - b.reviewTime,
    //   sortOrder: sortedInfo.columnKey === 'reviewTime' ? sortedInfo.order : null,
    //   ellipsis: true,
    //   showSorterTooltip: false
    // },
    {
      title: 'Trạng thái',
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
          {text === '6' && <span className='status-apply-job not-contactable'>Không thể liên hệ</span>}
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
            <a onClick={() => setOpenModalInfo(true)}>
              <BsFillEyeFill />
            </a>
          </Tooltip>

          {record.status === '0' && (
            <>
              <Tooltip title='Chấp nhận CV'>
                <a>
                  <ImUserCheck />
                </a>
              </Tooltip>
              <Tooltip title='Từ chối CV'>
                <a style={{ fontSize: '19px' }}>
                  <BiSolidUserX />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === '1' && (
            <>
              <Tooltip title='Interview'>
                <a style={{ fontSize: '19px' }}>
                  <MdConnectWithoutContact />
                </a>
              </Tooltip>
              <a>
                <Tooltip title='Không thể liên hệ'>
                  <BiCommentError />
                </Tooltip>
              </a>
            </>
          )}
          {record.status === '3' && (
            <>
              <Tooltip title='Chấp nhận CV'>
                <a>
                  <ImUserCheck />
                </a>
              </Tooltip>
              <Tooltip title='Từ chối CV'>
                <a style={{ fontSize: '19px' }}>
                  <BiSolidUserX />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === '4' && (
            <>
              <a>
                <Tooltip title='Nhận việc'>
                  <FaUserCheck />
                </Tooltip>
              </a>
              <Tooltip title='Từ chối'>
                <a style={{ fontSize: '19px' }}>
                  <BiSolidUserX />
                </a>
              </Tooltip>
            </>
          )}
          {record.status === '6' && (
            <>
              <Tooltip title='Interview'>
                <a style={{ fontSize: '19px' }}>
                  <MdConnectWithoutContact />
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
              {/* <Tooltip title='In CV'>
                <a>
                  <AiFillPrinter />
                </a>
              </Tooltip> */}

              <Tooltip title='Hủy bỏ'>
                <a>
                  <MdDelete />
                </a>
              </Tooltip>

              <Tooltip title='Thêm vào sổ đen'>
                <a>
                  <BiBlock />
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
      <Row className='filter-container'>
        <Col md={8} sm={24} xs={24} style={{ padding: '5px' }}>
          <Input
            onChange={(e) => setContent(e.target.value)}
            size='large'
            placeholder='Tìm kiếm tên, email, số điện thoại'
            prefix={<FiSearch />}
          />
        </Col>
        <Col md={6} sm={8} xs={24} style={{ padding: '5px' }}>
          <Select
            allowClear
            defaultValue='allJobs'
            size='large'
            style={{ width: '100%' }}
            showSearch
            onChange={handleChange}
            options={listJobs}
          />
        </Col>
        <Col md={5} sm={8} xs={24} style={{ padding: '5px' }}>
          <RangePicker
            style={{ width: '100%' }}
            size='large'
            placeholder={['Từ ngày', 'Đến ngày']}
            format='YYYY-MM-DD'
            onChange={(_, valueStrings) => setDateFormTo(valueStrings)}
            // locale={viVN}
          />
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
                setIdPost(record.id)
                setDataRowSelected(record)
              }
            })}
            columns={columns}
            dataSource={listJobsApplied}
            onChange={handleChangeRowTable}
            pagination={{ pageSize: limit, total: totalPage }}
          />
        </div>
      </div>
    </div>
  )
}

export default ContentCVManage
