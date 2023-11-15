import { Col, Input, Row, Select, Space, Table, Tag, Tooltip } from 'antd'
import '../../../UsersManage/style.scss'
// import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { BsFillCheckCircleFill, BsFillEyeFill } from 'react-icons/bs'
import { TiDelete } from 'react-icons/ti'
import { FiSearch } from 'react-icons/fi'
import { DatePicker } from 'antd'
import ModalInfoPost from '~/features/Employer/pages/Dashboard/components/ModalInfoPost/ModalInfoPost'
const { RangePicker } = DatePicker
import { useEffect, useState } from 'react'
import apiAdmin, { JobSearchByAdmin } from '~/api/admin.api'
import { toast } from 'react-toastify'
import { format, parseISO } from 'date-fns'
import { NotifyState } from '~/components/Header/NotifyDrawer/notifySlice'
import { RootState } from '~/app/store'
import { useSelector } from 'react-redux'
interface DataType {
  id: string
  nameJob: string
  nameCompany: string
  requestDate: string
  updateDate: string
  status: number
}

const ListPostReview = () => {
  const notificaions: NotifyState = useSelector((state: RootState) => state.notify)
  const [postID, setPostID] = useState('')
  const [openModalDetailPost, setOpenModalDetailPost] = useState(false)
  const [listPostRequest, setListPostRequest] = useState<DataType[]>([])
  const [total, setTotal] = useState(1)
  const limit = 5
  const [currentPage, setCurrentPage] = useState(1)
  //request search
  const [content, setContent] = useState('')
  const [dateFormTo, setDateFormTo] = useState<string[]>()
  const [status, setStatus] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)
  //
  useEffect(() => {
    if (notificaions.page > 0) fetchGetListPostRequest(currentPage.toString())
  }, [notificaions.notifications])
  useEffect(() => {
    setCurrentPage(1)
    fetchGetListPostRequest()
  }, [content, dateFormTo, status])
  useEffect(() => {
    if (isSubmit) {
      fetchGetListPostRequest(currentPage.toString())
      setIsSubmit(false)
    }
  }, [isSubmit])
  const fetchGetListPostRequest = async (page?: string) => {
    let request: JobSearchByAdmin = {
      content: content,
      from_day: dateFormTo ? dateFormTo[0] : '',
      to_day: dateFormTo ? dateFormTo[1] : '',
      status: status,
      limit: limit.toString(),
      page: page ? page : '1'
    }
    await apiAdmin.getAllPostRequest(request).then((rs) => {
      const listTemp: DataType[] = []
      rs.result.jobs.map((job: any) => {
        listTemp.push({
          id: job._id,
          nameJob: job.job_title,
          nameCompany: job.company.company_name,
          requestDate: format(parseISO(job.posted_date), 'dd-MM-yyyy HH:mm:ss'),
          status: job.status,
          updateDate: format(parseISO(job.updated_at), 'dd-MM-yyyy HH:mm:ss')
        })
      })
      setListPostRequest(listTemp)
      setTotal(rs.result.total)
    })
  }
  const handleActionRequest = async (type: string, id: string) => {
    if (type === 'APPROVE') {
      await apiAdmin
        .postApprovePostRequest(id)
        .then(async (rs) => {
          if (rs.message === 'job status is not pending to approve') {
            toast.error(
              `#POST_${id.slice(-5).toUpperCase()} không thuộc trạng thái đang chờ, vui lòng tải lại trang để thử lại`
            )
            return
          }
          await fetchGetListPostRequest().then(() => {
            toast.success(`Đã thành công duyệt bài đăng #POST_${id.slice(-5).toUpperCase()}`)
          })
        })
        .catch(() => {
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại')
        })
    }
    if (type === 'REJECT') {
      await apiAdmin
        .postRejectPostRequest(id)
        .then(async (rs) => {
          if (rs.message === 'job status is not pending to approve') {
            toast.error(
              `#POST_${id.slice(-5).toUpperCase()} không thuộc trạng thái đang chờ, vui lòng tải lại trang để thử lại`
            )
            return
          }

          await fetchGetListPostRequest().then(() => {
            toast.success(`Đã thành công từ chối duyệt bài đăng #POST_${id.slice(-5).toUpperCase()}`)
          })
        })
        .catch(() => {
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại')
        })
    }
  }
  const handleAfterSubmit = () => {
    setIsSubmit(true)
    setOpenModalDetailPost(false)
  }
  const handleOnchangePageClick = async (page: number) => {
    setCurrentPage(page)
    await fetchGetListPostRequest(page.toString())
  }
  const handleOpenModalDetailPost = (id: string) => {
    setPostID(id)
    setOpenModalDetailPost(true)
  }
  const columns: ColumnsType<DataType> = [
    {
      ellipsis: true,
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value, _) => <span key={value}>{`POST_${value.slice(-5).toUpperCase()}`}</span>
    },
    {
      ellipsis: true,
      title: 'Tên công việc',
      dataIndex: 'nameJob',
      key: 'nameJob'
    },
    {
      ellipsis: true,
      title: 'Công ty',
      dataIndex: 'nameCompany',
      key: 'nameCompany'
    },
    {
      ellipsis: true,
      title: 'Ngày yêu cầu',
      dataIndex: 'requestDate',
      key: 'requestDate'
    },
    {
      ellipsis: true,
      title: 'Cập nhật gần nhất',
      key: 'updateDate',
      dataIndex: 'updateDate'
    },
    {
      ellipsis: true,
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (_, record) => (
        <>
          {record.status === 1 && <Tag color={'orange'}>Đang chờ</Tag>}
          {record.status === 0 && <Tag color={'green'}>Chấp nhận</Tag>}
          {record.status === 2 && <Tag color={'red'}>Từ chối</Tag>}
        </>
      )
    },
    {
      ellipsis: true,
      title: 'Xử lý',
      key: 'action',
      fixed: 'right',
      align: 'left',
      render: (_, record) => (
        <Space size={'middle'} style={{ textAlign: 'center' }}>
          <Tooltip title='Chi tiết'>
            <a
              onClick={() => handleOpenModalDetailPost(record.id)}
              style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
            >
              <BsFillEyeFill />
            </a>
          </Tooltip>
          {record.status !== 1 ? (
            <></>
          ) : (
            <>
              <Tooltip title='Chấp nhận'>
                <a
                  onClick={() => handleActionRequest('APPROVE', record.id)}
                  style={{ fontSize: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
                >
                  <BsFillCheckCircleFill />
                </a>
              </Tooltip>
              <Tooltip title='Từ chối'>
                <a
                  onClick={() => handleActionRequest('REJECT', record.id)}
                  style={{ fontSize: '17px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
                >
                  <TiDelete />
                </a>
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className='post-review-manage-container admin-users-manage-container'>
      <div className='title'>Kiểm duyệt bài đăng</div>
      <div className='content-wapper'>
        <Row style={{ gap: '10px', marginBottom: '15px' }}>
          <Col md={8} sm={24} xs={24}>
            <Input
              allowClear
              onChange={(e) => setContent(e.target.value)}
              className='input-search-user'
              size='large'
              placeholder='ID, tên công việc, công ty'
              prefix={<FiSearch />}
            />
          </Col>
          <Col md={6} sm={16} xs={12}>
            <RangePicker
              onChange={(_, dataStr) => setDateFormTo(dataStr)}
              style={{ width: '100%' }}
              size='large'
              placeholder={['Từ ngày', 'Đến ngày']}
              format='YYYY-MM-DD'
              // locale={viVN}
            />
          </Col>
          <Col md={4} sm={7} xs={11}>
            <Select
              onChange={(value) => setStatus(value === 'all' ? '' : value)}
              size='large'
              style={{ width: '100%' }}
              defaultValue='all'
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: '1', label: 'Đang chờ' },
                { value: '0', label: 'Chấp nhận' },
                { value: '2', label: 'Từ chối' }
              ]}
            />
          </Col>
        </Row>
        <ModalInfoPost
          handleAfterSubmit={handleAfterSubmit}
          open={openModalDetailPost}
          idPost={postID}
          roleType='ADMIN_ROLE'
          handleClose={() => setOpenModalDetailPost(false)}
        />
        <Table
          rowKey='id'
          className='table-custom users-table'
          scroll={{ x: true }}
          columns={columns}
          dataSource={listPostRequest}
          pagination={{ pageSize: limit, total: total, onChange: handleOnchangePageClick, current: currentPage }}
        />
      </div>
    </div>
  )
}

export default ListPostReview
