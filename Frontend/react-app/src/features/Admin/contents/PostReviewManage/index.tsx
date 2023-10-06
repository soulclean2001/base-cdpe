import { Col, Input, Row, Select, Space, Table, Tabs, Tag } from 'antd'
import './style.scss'
import { ColumnsType } from 'antd/es/table'
import { BsFillCheckCircleFill, BsFillEyeFill } from 'react-icons/bs'
import { TiDelete } from 'react-icons/ti'
import { FiSearch } from 'react-icons/fi'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker
interface DataType {
  key: string
  nameJob: string
  nameCompany: string
  requestDate: string
  updateDate: string
  status: string | number
}
const PostReviewManage = () => {
  const columns: ColumnsType<DataType> = [
    {
      ellipsis: true,
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
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
      align: 'center',
      render: (_, record) => (
        <Space size={'middle'} style={{ textAlign: 'center' }}>
          <a style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
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
      key: '1',
      nameJob: 'Web intern',
      nameCompany: 'Công ty XX',
      requestDate: '26/09/2023',
      updateDate: '26/09/2023',
      status: 'Đang chờ'
    },
    {
      key: '2',
      nameJob: 'Fresher',
      nameCompany: 'Công ty Y',
      requestDate: '26/09/2023',
      updateDate: '26/09/2023',
      status: 'Chấp nhận'
    },
    {
      key: '3',
      nameJob: 'Grab',
      nameCompany: 'GarbVN',
      requestDate: '26/09/2023',
      updateDate: '26/09/2023',
      status: 'Từ chối'
    }
  ]
  return (
    <div className='post-review-manage-container'>
      <div className='title'>Kiểm duyệt bài đăng</div>

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

      <Table className='table-custom users-table' scroll={{ x: true }} columns={columns} dataSource={data} />
    </div>
  )
}

export default PostReviewManage
