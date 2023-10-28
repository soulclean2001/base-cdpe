import { Col, Input, Row, Select, Table } from 'antd'
import { ColumnsType, TableProps } from 'antd/es/table'
import { SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import './style.scss'
import { BsFillEyeFill, BsSearch } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import ModalInfoPost from '../../../../components/ModalInfoPost/ModalInfoPost'
import { DatePicker } from 'antd'
import { BiWorld } from 'react-icons/bi'
import { AiFillLock } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/store'

import { setPosts } from '~/features/Employer/employerSlice'
// import viVN from 'antd/es/locale/vi_VN'
import apiPost, { PostFilterRequestType } from '~/api/post.api'

const { RangePicker } = DatePicker

export interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}

export interface SalararyRange {
  min: number
  max: number
}

export interface Benefit {
  type: string
  value: string
}

export interface JobType {
  id?: string
  job_title: string
  company_id: string
  alias: string //link tren url
  is_salary_visible: boolean // hiện mức lương
  pretty_salary: string
  expired_date?: Date
  user_id: string
  working_locations: WorkingLocation[]
  industries: string[] // linh vuc cong ty
  skills: string[] // ky nang
  job_level: string // cap bac
  posted_date?: Date // ngay dang
  salary_range: SalararyRange
  job_description: string
  job_requirement: string
  job_type: string
  salary: string
  status: string
  visibility: boolean // hiển thị
  benefits: Benefit[] // phúc lợi
  number_of_employees_needed: number
  application_email: string
  created_at?: Date
  updated_at?: Date
  user: {
    name: string
    email: string
  }
  total_applied: number
}
// muon bỏ buoc call api à
const TableCustom = (props: any) => {
  const { isSubmit, tabKey } = props
  const [sortedInfo, setSortedInfo] = useState<SorterResult<JobType>>({})
  const dispatch = useDispatch()
  const [isUpdate, setIsUpDate] = useState(false)
  const employer = useSelector((state: RootState) => state.employer)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<JobType[]>([])
  const [openModalInfo, setOpenModalInfo] = useState(false)
  const [dataRowSelected, setDataRowSelected] = useState<JobType>()
  const [idPost, setIdPost] = useState<string>()
  const limit = 3

  // const total = employer.posts.total
  const [total, setTotal] = useState(1)

  const [content, setContent] = useState('')
  const [rangeDate, setRangeDate] = useState<Array<string>>([])

  const handleChange: TableProps<JobType>['onChange'] = async (pagination, filters, sorter) => {
    // console.log('log data', pagination, filters, sorter)
    console.log(pagination.current as number)
    setCurrentPage(pagination.current as number)
    setSortedInfo(sorter as SorterResult<JobType>)
    await fetchData(pagination.current?.toString())
  }

  // get data

  useEffect(() => {
    fetchData()
  }, [tabKey, content, rangeDate])
  useEffect(() => {
    if (isUpdate) {
      fetchData(currentPage.toString())
    }
  }, [isUpdate])
  useEffect(() => {
    if (isSubmit) {
      fetchData(currentPage.toString())
    }
  }, [isSubmit])
  const fetchData = async (page?: string) => {
    const initReq = { limit: limit.toString(), page: page ? page : '1' }
    let request: PostFilterRequestType = initReq
    if (tabKey === 'tab-publish') request = { ...initReq, visibility: true }
    if (tabKey === 'tab-hide') request = { ...initReq, visibility: false }
    if (tabKey === 'tab-over-time-7-day') request = { ...initReq, expired_before_nday: 7 }
    if (tabKey === 'tab-over-time') request = { ...initReq, is_expired: true }
    if (content) request = { ...request, content }
    if (rangeDate && rangeDate[0] && rangeDate[1])
      request = { ...request, from_day: rangeDate[0], to_day: rangeDate[1] }

    console.log('request', request)
    await apiPost.getPostsFormEmployer(request).then((rs) => {
      console.log(rs)
      dispatch(setPosts(rs.result))
      setData(rs.result.data)
      setTotal(rs.result.total)
    })
  }
  // kiểm tra data thay đổi
  // useEffect(() => {
  //   setData(employer.posts.data)
  // }, [employer])

  const columns: ColumnsType<JobType> = [
    {
      title: 'Tên công việc',
      dataIndex: 'job_title',
      key: 'job_title',
      sorter: (a, b) => a.job_title.localeCompare(b.job_title),
      sortOrder: sortedInfo.columnKey === 'job_title' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Cấp bậc',
      dataIndex: 'job_level',
      key: 'job_level',
      sorter: (a, b) => a.job_level.localeCompare(b.job_level),
      sortOrder: sortedInfo.columnKey === 'job_level' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Loại việc làm',
      dataIndex: 'job_type',
      key: 'job_type',
      sorter: (a, b) => a.job_type.localeCompare(b.job_type),
      sortOrder: sortedInfo.columnKey === 'job_type' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    {
      title: 'Mức lương',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a, b) => a.salary.localeCompare(b.salary),
      sortOrder: sortedInfo.columnKey === 'salary' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false
    },
    // {
    //   title: 'Khu vực',
    //   dataIndex: 'province',
    //   key: 'province',
    //   sorter: (a, b) => a.province.localeCompare(b.province),
    //   sortOrder: sortedInfo.columnKey === 'province' ? sortedInfo.order : null,
    //   ellipsis: true,
    //   showSorterTooltip: false
    // },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => {
        return a.created_at && b.created_at && a.created_at > b.created_at ? -1 : 1
      },
      sortOrder: sortedInfo.columnKey === 'created_at' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,
      render: (date: Date) => (date ? date.toString().slice(0, 10) : '')
    },

    {
      title: 'Hạn nộp CV',
      dataIndex: 'expired_date',
      key: 'expired_date',
      sorter: (a, b) => {
        return a.expired_date && b.expired_date && a.expired_date > b.expired_date ? -1 : 1
      },
      sortOrder: sortedInfo.columnKey === 'expired_date' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,
      render: (date: Date) => (date ? date.toString().slice(0, 10) : '')
    },
    {
      title: 'Hồ sơ ứng tuyển',
      dataIndex: 'total_applied ',
      key: 'total_applied ',
      sorter: (a, b) => a.total_applied - b.total_applied,
      sortOrder: sortedInfo.columnKey === 'total_applied ' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,
      render: (value, _) => <span>{value ? value : 0}</span>
    },
    {
      title: 'Xử lý',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (_, item) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <a onClick={() => setOpenModalInfo(true)}>
            <BsFillEyeFill />
          </a>

          <a>
            <MdDelete />
          </a>

          {item.visibility && (
            <a>
              <AiFillLock />
            </a>
          )}
          {!item.visibility && (
            <a>
              <BiWorld />
            </a>
          )}
        </div>
      ),
      showSorterTooltip: false
    }
  ]
  const hiddenColumn: ColumnsType<JobType> = [
    {
      title: 'Kiểm duyệt',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,
      render: (value, _) => (
        <>
          {value === 1 && <span>Chờ duyệt</span>} {value === 0 && <span>Chấp nhận</span>}
          {value === 2 && <span>Từ chối</span>}
          {value === 3 && <span>Chưa kiểm duyệt</span>}
        </>
      )
    }
  ]
  const anotherColumns: ColumnsType<JobType> = [
    {
      title: 'Hiển thị',
      dataIndex: 'visibility',
      key: 'visibility',
      sorter: (a, b) => {
        return a.visibility && b.visibility && a.visibility > b.visibility ? -1 : 1
      },
      sortOrder: sortedInfo.columnKey === 'visibility' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,
      render: (value, _) => <span>{value ? 'Công khai' : 'Riêng tư'}</span>
    }
  ]

  useEffect(() => {
    console.log('data row selected', dataRowSelected)
  }, [dataRowSelected])

  const handleSetColumnTable = () => {
    if (tabKey === 'tab-publish') {
      return columns
    }
    if (tabKey === 'tab-hide') {
      const hideTemp: ColumnsType<JobType> = [
        ...columns.slice(0, columns.length - 1),
        hiddenColumn[0],
        ...columns.slice(columns.length - 1, columns.length)
      ]

      // setColumnState(hideTemp)
      return hideTemp
    }
    if (tabKey === 'tab-over-time-7-day' || tabKey === 'tab-over-time') {
      const anotherTemp: ColumnsType<JobType> = [
        ...columns.slice(0, columns.length - 1),
        hiddenColumn[0],
        anotherColumns[0],
        ...columns.slice(columns.length - 1, columns.length)
      ]
      // setColumnState(anotherTemp)
      return anotherTemp
    }
  }
  const handleAfterSubmit = () => {
    setOpenModalInfo(false)
    setIsUpDate(true)
  }

  const handleCloseModalInfo = () => {
    setIsUpDate(false)
    setOpenModalInfo(false)
  }
  return (
    <>
      <ModalInfoPost
        handleAfterSubmit={handleAfterSubmit}
        idPost={idPost}
        open={openModalInfo}
        handleClose={handleCloseModalInfo}
      />
      <Row style={{ width: '100%', marginBottom: '16px', gap: '10px' }}>
        <Col md={6} sm={11} xs={24}>
          <Input
            allowClear
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '95%' }}
            size='large'
            placeholder='Tìm theo tên, id bài đăng'
            prefix={<BsSearch />}
          />
        </Col>
        <Col md={6} sm={11} xs={24}>
          <RangePicker
            style={{ width: '95%' }}
            size='large'
            placeholder={['Từ ngày', 'Đến ngày']}
            format='YYYY-MM-DD'
            // locale={viVN}
            onChange={(_, dateStrings) => {
              setRangeDate(dateStrings)
            }}
          />
        </Col>
        {tabKey !== 'tab-publish' && (
          <Col md={5} sm={11} xs={24}>
            <Select
              style={{ width: '95%' }}
              size='large'
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả trạng thái kiểm duyệt' },
                { value: 0, label: 'Chờ duyệt' },
                { value: 1, label: 'Chấp nhận' },
                { value: 2, label: 'Từ chối' }
              ]}
            />
          </Col>
        )}
        {(tabKey === 'tab-over-time-7-day' || tabKey === 'tab-over-time') && (
          <Col md={5} sm={11} xs={24}>
            <Select
              style={{ width: '95%' }}
              size='large'
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả trạng thái hiển thị' },
                { value: 0, label: 'Công khai' },
                { value: 1, label: 'Riêng tư' }
              ]}
            />
          </Col>
        )}
      </Row>

      <Table
        rowKey='id'
        className='table-custom'
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => {
            setIdPost(record.id)
            setDataRowSelected(record)
          }
        })}
        columns={handleSetColumnTable()}
        dataSource={data.slice(0, limit)}
        onChange={handleChange}
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: total
        }}
      />
    </>
  )
}

export default TableCustom
