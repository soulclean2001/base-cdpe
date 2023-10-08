import { Button, Col, Input, Row, Select, Space, Table, Tabs, Tag } from 'antd'

import '../PostReviewManage/style.scss'
import './style.scss'
import '../UsersManage/style.scss'
import { FiSearch } from 'react-icons/fi'
import { ColumnsType } from 'antd/es/table'
import { BsFillEyeFill, BsFillTrashFill } from 'react-icons/bs'

import { AiFillEdit, AiFillPlusCircle } from 'react-icons/ai'
import { TabsProps } from 'antd/lib'
import { FaTrashRestoreAlt } from 'react-icons/fa'
interface DataType {
  key: string
  nameService: string
  validityPeriod: string
  price: string | number
  updateDate: string
  status: string
}
const data: DataType[] = [
  {
    key: '1',
    nameService: 'Đăng Tuyển 30 ngày',
    validityPeriod: '30 ngày',
    price: 400000,
    updateDate: '26/09/2023',
    status: 'Hoạt động'
  },
  {
    key: '2',
    nameService: 'Công ty hàng đầu',
    validityPeriod: '1 năm',
    price: 440000,
    updateDate: '26/09/2023',
    status: 'Hoạt động'
  },
  {
    key: '3',
    nameService: 'Xem thông tin liên hệ',
    validityPeriod: '30 ngày',
    price: 500000,
    updateDate: '26/09/2023',
    status: 'Đã xóa'
  }
]
const columns: ColumnsType<DataType> = [
  {
    ellipsis: true,
    title: 'ID',
    dataIndex: 'key',
    key: 'key',
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
        {status === 'Hoạt động' && <Tag color={'green'}>{status}</Tag>}
        {status === 'Đã xóa' && <Tag color={'red'}>{status}</Tag>}
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
        <a style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <AiFillEdit />
        </a>
        {record.status === 'Hoạt động' ? (
          <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <BsFillTrashFill />
          </a>
        ) : (
          <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <FaTrashRestoreAlt />
          </a>
        )}
      </Space>
    )
  }
]
const ServicesManage = () => {
  const onChangeTab = (key: string) => {
    console.log(key)
  }
  const items: TabsProps['items'] = [
    {
      key: 'tab-workings',
      label: <div className='tab-item'>Hoạt động</div>,
      children: <></>
    },
    {
      key: 'tab-deleted',
      label: <div className='tab-item'>Đã xóa</div>,
      children: <></>
    }
  ]
  return (
    <div className='services-manage-page-container admin-users-manage-container'>
      <div className='title'>Quản lý gói dịch vụ</div>
      <Button className='btn-add' size='large' icon={<AiFillPlusCircle />}>
        Thêm mới
      </Button>
      <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='1' items={items} />
      <div className='content-wapper'>
        <Row style={{ gap: '10px', marginBottom: '15px' }}>
          <Col md={8} sm={24} xs={24}>
            <Input className='input-search-services' size='large' placeholder='ID, tên dịch vụ' prefix={<FiSearch />} />
          </Col>
          <Col md={4} sm={7} xs={11}>
            <Select
              size='large'
              style={{ width: '100%' }}
              defaultValue='Thời gian hiệu lực'
              options={[{ value: 'Tất cả thời gian' }, { value: '30 ngày' }, { value: '90 ngày' }, { value: '1 năm' }]}
            />
          </Col>
        </Row>

        <Table className='table-custom users-table' scroll={{ x: true }} columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default ServicesManage
