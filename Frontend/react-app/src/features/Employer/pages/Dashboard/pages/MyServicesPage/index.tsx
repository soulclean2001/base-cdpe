import { Col, Input, Row, Select, Space, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { BsFillEyeFill, BsFillTrashFill } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { MdPayments } from 'react-icons/md'
import './style.scss'
const MyServicesPage = () => {
  interface DataType {
    id: string
    nameService: string
    validityPeriod: string
    price: string | number
    activeDate: string
    expiryDate: string
    status: string
  }
  const data: DataType[] = [
    {
      id: '1',
      nameService: 'Đăng Tuyển 30 ngày',
      validityPeriod: '30 ngày',
      price: 400000,
      activeDate: '26/08/2023',
      expiryDate: '26/09/2023',
      status: 'Hoạt động'
    },
    {
      id: '2',
      nameService: 'Công ty hàng đầu',
      validityPeriod: '1 năm',
      price: 440000,
      activeDate: '26/08/2023',
      expiryDate: '26/09/2023',
      status: 'Hoạt động'
    },
    {
      id: '3',
      nameService: 'Xem thông tin liên hệ',
      validityPeriod: '30 ngày',
      price: 500000,
      activeDate: '26/08/2023',
      expiryDate: '26/09/2023',
      status: 'Hết hạn'
    }
  ]
  const columns: ColumnsType<DataType> = [
    {
      ellipsis: true,
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value, _) => <span key={value}>{`SV_${value}`}</span>
    },
    {
      ellipsis: true,
      title: 'Tên dịch vụ',
      dataIndex: 'nameService',
      key: 'nameService'
    },
    {
      ellipsis: true,
      title: 'Thời gian hiệu lực',
      dataIndex: 'validityPeriod',
      key: 'validityPeriod'
    },
    {
      ellipsis: true,
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (value, _) => <span key={value}>{value.toLocaleString('vi', { currency: 'VND' })}</span>
    },
    {
      ellipsis: true,
      title: 'Ngày kích hoạt',
      key: 'activeDate',
      dataIndex: 'activeDate'
    },
    {
      ellipsis: true,
      title: 'Ngày hết hạn',
      key: 'expiryDate',
      dataIndex: 'expiryDate'
    },

    {
      ellipsis: true,
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (_, { status }) => (
        <>
          {status === 'Hoạt động' && <Tag color={'green'}>{status}</Tag>}
          {status === 'Hết hạn' && <Tag color={'red'}>{status}</Tag>}
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
          <a style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <BsFillEyeFill />
          </a>

          {record.status === 'Hết hạn' && (
            <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <MdPayments />
            </a>
          )}
        </Space>
      )
    }
  ]
  return (
    <div className='my-services-page-container'>
      <div className='admin-users-manage-container'>
        <div className='title'>Dịch vụ của tôi</div>

        <div className='content-wapper'>
          <Row style={{ gap: '10px', marginBottom: '20px' }}>
            <Col md={8} sm={24} xs={24}>
              <Input
                className='input-search-services'
                size='large'
                placeholder='ID, tên dịch vụ'
                prefix={<FiSearch />}
              />
            </Col>
          </Row>

          <Table
            rowKey={'id'}
            className='table-custom users-table'
            scroll={{ x: true }}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
    </div>
  )
}

export default MyServicesPage
