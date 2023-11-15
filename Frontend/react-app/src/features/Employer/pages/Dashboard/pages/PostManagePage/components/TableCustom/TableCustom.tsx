import { Button, Col, Input, Modal, Row, Select, Table, Tag } from 'antd'
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
import { toast } from 'react-toastify'
import { NotifyState } from '~/components/Header/NotifyDrawer/notifySlice'

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
  careers: string[] // linh vuc cong ty
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

  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<JobType[]>([])
  const [openModalInfo, setOpenModalInfo] = useState(false)
  const [dataRowSelected, setDataRowSelected] = useState<JobType>()
  const [idPost, setIdPost] = useState<string>()
  const limit = 5
  //publish
  const [isOpenModalPublish, setIsOpenModalPublish] = useState(false)
  const [expiresDate, setExpires] = useState('')
  //
  //delete
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
  //
  // const total = employer.posts.total
  const [total, setTotal] = useState(1)
  const [publishStatus, setPublishStatus] = useState<boolean | string>('')
  const [acceptStatus, setAcceptStatus] = useState<number | string>('')
  const [content, setContent] = useState('')
  const [rangeDate, setRangeDate] = useState<Array<string>>([])

  const handleChange: TableProps<JobType>['onChange'] = async (pagination, _, sorter) => {
    // console.log('log data', pagination, filters, sorter)

    setCurrentPage(pagination.current as number)
    setSortedInfo(sorter as SorterResult<JobType>)
    await fetchData(pagination.current?.toString())
  }

  // get data
  useEffect(() => {
    if (notificaions.page > 0) fetchData(currentPage.toString())
  }, [notificaions.notifications])
  useEffect(() => {
    setCurrentPage(1)
    fetchData()
  }, [tabKey, content, rangeDate, publishStatus, acceptStatus])
  useEffect(() => {
    if (isUpdate) {
      fetchData(currentPage.toString()).then(() => setIsUpDate(false))
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
    if (tabKey === 'tab-hide') request = { ...initReq, visibility: false, status: acceptStatus as string }
    if (tabKey === 'tab-over-time-7-day')
      request = {
        ...initReq,
        expired_before_nday: 7,
        visibility: publishStatus as boolean,
        status: acceptStatus as string
      }
    if (tabKey === 'tab-over-time')
      request = { ...initReq, is_expired: true, visibility: publishStatus as boolean, status: acceptStatus as string }
    if (content) request = { ...request, content }
    if (rangeDate && rangeDate[0] && rangeDate[1])
      request = { ...request, from_day: rangeDate[0], to_day: rangeDate[1] }

    await apiPost.getPostsFormEmployer(request).then((rs) => {
      dispatch(setPosts(rs.result))
      setData(rs.result.data)
      setTotal(rs.result.total)
    })
  }

  const handleSubmitModalPublish = async () => {
    if (!dataRowSelected || !idPost) return
    if (!expiresDate) {
      toast.error('Vui lòng chọn ngày hết hạn trước khi công khai bài đăng')
      return
    }
    await apiPost.publishPost(idPost, expiresDate).then(async () => {
      await fetchData()
      if (dataRowSelected.status === '0') toast.success(`#POST_${idPost.slice(-5).toUpperCase()} đã được công khai`)
      else toast.success(`Yêu cầu công khai #POST_${idPost.slice(-5).toUpperCase()} đã được gửi thành công`)
      setIsOpenModalPublish(false)
    })
  }
  const handleHidePost = async (id: string) => {
    if (!id) return
    await apiPost.hidePost(id).then(async () => {
      await fetchData()
      toast.success(`#POST_${id.slice(-5).toUpperCase()} đã được ẩn`)
    })
  }
  const handleCloseModalPublish = () => {
    setIsOpenModalPublish(false)
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
      render: (_, record) => <span>{record.total_applied ? record.total_applied : 0}</span>
    },
    {
      align: 'center',
      title: 'Kiểm duyệt',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,
      render: (value, _) => (
        <>
          {value === 1 && <Tag color={'orange'}>Chờ duyệt</Tag>}
          {value === 0 && <Tag color={'green'}>Chấp nhận</Tag>}
          {value === 2 && <Tag color={'red'}>Từ chối</Tag>}
          {value === 3 && <Tag color={'purple'}>Chưa kiểm duyệt</Tag>}
        </>
      )
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
          {item.visibility && (
            <a onClick={() => handleHidePost(item.id ? item.id : '')}>
              <AiFillLock />
            </a>
          )}
          {!item.visibility && Number(item.status) !== 1 && (
            <a onClick={() => setIsOpenModalPublish(true)}>
              <BiWorld />
            </a>
          )}
          {/* {Number(item.status) !== 1 && (
            <a onClick={handleOpenModalDelete}>
              <MdDelete />
            </a>
          )} */}
          <a onClick={handleOpenModalDelete}>
            <MdDelete />
          </a>
        </div>
      ),
      showSorterTooltip: false
    }
  ]
  // const hiddenColumn: ColumnsType<JobType> = [
  //   {
  //     title: 'Kiểm duyệt',
  //     dataIndex: 'status',
  //     key: 'status',
  //     sorter: (a, b) => a.status.localeCompare(b.status),
  //     sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
  //     ellipsis: true,
  //     showSorterTooltip: false,
  //     render: (value, _) => (
  //       <>
  //         {value === 1 && <span>Chờ duyệt</span>} {value === 0 && <span>Chấp nhận</span>}
  //         {value === 2 && <span>Từ chối</span>}
  //         {value === 3 && <span>Chưa kiểm duyệt</span>}
  //       </>
  //     )
  //   }
  // ]
  const anotherColumns: ColumnsType<JobType> = [
    {
      align: 'center',
      title: 'Hiển thị',
      dataIndex: 'visibility',
      key: 'visibility',
      sorter: (a, b) => {
        return a.visibility && b.visibility && a.visibility > b.visibility ? -1 : 1
      },
      sortOrder: sortedInfo.columnKey === 'visibility' ? sortedInfo.order : null,
      ellipsis: true,
      showSorterTooltip: false,

      render: (value, _) => <>{value ? <Tag color={'blue'}>Công khai</Tag> : <Tag color={'grey'}>Riêng tư</Tag>} </>
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
      // const hideTemp: ColumnsType<JobType> = [
      //   ...columns.slice(0, columns.length - 1),
      //   hiddenColumn[0],
      //   ...columns.slice(columns.length - 1, columns.length)
      // ]

      // setColumnState(hideTemp)
      return columns
    }
    if (tabKey === 'tab-over-time-7-day' || tabKey === 'tab-over-time') {
      const anotherTemp: ColumnsType<JobType> = [
        ...columns.slice(0, columns.length - 1),
        // hiddenColumn[0],
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
  const handleOpenModalDelete = () => {
    setIsOpenModalDelete(true)
  }
  const handleCloseModalDelete = () => {
    setIsOpenModalDelete(false)
  }
  const handleConfirmDelete = async () => {
    if (!idPost) return
    await apiPost.deletePost(idPost).then(async () => {
      await fetchData()
      toast.success(`#POST_${idPost.slice(-5).toUpperCase()} đã được xóa thành công`)
      setIsOpenModalDelete(false)
    })
  }
  return (
    <>
      <Modal footer='' cancelText={'Thoát'} width={300} open={isOpenModalDelete} onCancel={handleCloseModalDelete}>
        <div
          style={{
            paddingBottom: '20px',

            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',

            borderRadius: '7px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <h4>Bạn có chắc muốn xóa bài đăng #POST_{idPost && idPost.slice(-5).toUpperCase()}?</h4>

          <div style={{ marginTop: '25px', display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
            <Button size='middle' onClick={handleCloseModalDelete}>
              Thoát
            </Button>
            <Button
              size='middle'
              onClick={handleConfirmDelete}
              style={{ background: 'rgb(255, 125, 85)', color: 'white' }}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        footer=''
        cancelText={'Thoát'}
        width={300}
        title={
          <h4
            style={{
              paddingBottom: '15px'
            }}
          >
            CÔNG KHAI #POST_{idPost && idPost.slice(-5).toUpperCase()}
          </h4>
        }
        open={isOpenModalPublish}
        onCancel={handleCloseModalPublish}
      >
        <div
          style={{
            paddingBottom: '20px',
            marginBottom: '20px',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',

            borderRadius: '7px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <h4>Chọn ngày hết hạn</h4>
          <DatePicker placeholder='Chọn ngày' size='large' onChange={(_, str) => setExpires(str)} />
          <div style={{ marginTop: '25px', display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
            <Button size='middle' onClick={handleCloseModalPublish}>
              Thoát
            </Button>
            <Button
              size='middle'
              onClick={handleSubmitModalPublish}
              style={{ background: 'rgb(255, 125, 85)', color: 'white' }}
            >
              Tạo
            </Button>
          </div>
        </div>
      </Modal>
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
              onChange={(value) => setAcceptStatus(value === 'all' ? '' : value)}
              style={{ width: '95%' }}
              size='large'
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả trạng thái kiểm duyệt' },
                { value: 1, label: 'Chờ duyệt' },
                { value: 0, label: 'Chấp nhận' },
                { value: 2, label: 'Từ chối' },
                { value: 3, label: 'Chưa kiểm duyệt' }
              ]}
            />
          </Col>
        )}
        {(tabKey === 'tab-over-time-7-day' || tabKey === 'tab-over-time') && (
          <Col md={5} sm={11} xs={24}>
            <Select
              onChange={(value) => setPublishStatus(value === 'all' ? '' : value)}
              style={{ width: '95%' }}
              size='large'
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả trạng thái hiển thị' },
                { value: true, label: 'Công khai' },
                { value: false, label: 'Riêng tư' }
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
