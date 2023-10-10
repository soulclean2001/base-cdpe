import { Col, Input, Row, Select, Space, Table, Tabs, Tag } from 'antd'
import '../../../UsersManage/style.scss'
// import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { BsFillCheckCircleFill, BsFillEyeFill } from 'react-icons/bs'
import { TiDelete } from 'react-icons/ti'
import { FiSearch } from 'react-icons/fi'
import { DatePicker } from 'antd'
import ModalInfoPost from '~/features/Employer/pages/Dashboard/components/ModalInfoPost/ModalInfoPost'
const { RangePicker } = DatePicker
import { useState } from 'react'
interface DataType {
  id: string
  nameJob: string
  nameCompany: string
  requestDate: string
  updateDate: string
  status: string | number
}
const ListPostReview = () => {
  const [postID, setPostID] = useState('')
  const [openModalDetailPost, setOpenModalDetailPost] = useState(false)
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
      render: (value, _) => <span key={value}>{`POST_${value}`}</span>
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
      render: (_, { status }) => (
        <>
          {status === 'Đang chờ' && <Tag color={'orange'}>{status}</Tag>}
          {status === 'Chấp nhận' && <Tag color={'green'}>{status}</Tag>}
          {status === 'Từ chối' && <Tag color={'red'}>{status}</Tag>}
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
          <a
            onClick={() => handleOpenModalDetailPost(record.id)}
            style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
          >
            <BsFillEyeFill />
          </a>
          {record.status !== 'Đang chờ' ? (
            <></>
          ) : (
            <>
              <a style={{ fontSize: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <BsFillCheckCircleFill />
              </a>
              <a style={{ fontSize: '17px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <TiDelete />
              </a>
            </>
          )}
        </Space>
      )
    }
  ]

  const data: DataType[] = [
    {
      id: '65167d32e569685ca8a7f3c0',
      nameJob: 'Web intern',
      nameCompany: 'Công ty XX',
      requestDate: '26/09/2023',
      updateDate: '26/09/2023',
      status: 'Đang chờ'
    },
    {
      id: '2',
      nameJob: 'Fresher',
      nameCompany: 'Công ty Y',
      requestDate: '26/09/2023',
      updateDate: '26/09/2023',
      status: 'Chấp nhận'
    },
    {
      id: '3',
      nameJob: 'Grab',
      nameCompany: 'GarbVN',
      requestDate: '26/09/2023',
      updateDate: '26/09/2023',
      status: 'Từ chối'
    }
  ]
  return (
    <div className='post-review-manage-container admin-users-manage-container'>
      <div className='title'>Kiểm duyệt bài đăng</div>
      <div className='content-wapper'>
        <Row style={{ gap: '10px', marginBottom: '15px' }}>
          <Col md={8} sm={24} xs={24}>
            <Input
              className='input-search-user'
              size='large'
              placeholder='ID, tên công việc, công ty'
              prefix={<FiSearch />}
            />
          </Col>
          <Col md={6} sm={16} xs={12}>
            <RangePicker
              style={{ width: '100%' }}
              size='large'
              placeholder={['Từ ngày', 'Đến ngày']}
              format='DD-MM-YYYY'
              // locale={viVN}
            />
          </Col>
          <Col md={4} sm={7} xs={11}>
            <Select
              size='large'
              style={{ width: '100%' }}
              defaultValue='Tất cả'
              options={[
                { value: 'Tất cả trạng thái' },
                { value: 'Đang chờ' },
                { value: 'Chấp nhận' },
                { value: 'Từ chối' }
              ]}
            />
          </Col>
        </Row>
        <ModalInfoPost
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
          dataSource={data}
        />
      </div>
    </div>
  )
}

export default ListPostReview
