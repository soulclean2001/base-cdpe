import { Col, Input, Row, Select, Space, Table, Tabs, Tag } from 'antd'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker
import './style.scss'
import { BsFillEyeFill, BsFillTrashFill } from 'react-icons/bs'
import { AiFillCheckCircle, AiFillEdit } from 'react-icons/ai'
import { ColumnsType } from 'antd/es/table'
import { useState, useEffect } from 'react'
import { TabsProps } from 'antd/lib'
import { FiSearch } from 'react-icons/fi'
import apiAdmin, { OrderSearchByAdmin } from '~/api/admin.api'
interface ServiceType {
  id: string
  nameService: string
  quantity: number
}
interface DataType {
  key: string
  services: Array<ServiceType>
  nameCompany: string
  totalPayment: string | number
  orderDate: string
  updateDate: string
  status: string
}
interface AnyType {
  [key: string]: any
}
const data: DataType[] = [
  {
    key: '1',
    services: [
      { id: '1', nameService: 'Đăng Tuyển 30 ngày', quantity: 1 },
      { id: '2', nameService: 'Công ty hàng đầu', quantity: 1 }
    ],
    nameCompany: 'Công ty X',
    totalPayment: 400000,
    orderDate: '26/09/2023',
    updateDate: '26/09/2023',
    status: 'Chờ thanh toán'
  },
  {
    key: '2',
    services: [{ id: '1', nameService: 'Đăng Tuyển 30 ngày', quantity: 2 }],
    nameCompany: 'Công ty X',
    totalPayment: 420000,
    orderDate: '26/09/2023',
    updateDate: '26/09/2023',
    status: 'Hoàn tất'
  },
  {
    key: '3',
    services: [{ id: '2', nameService: 'Công ty hàng đầu', quantity: 3 }],
    nameCompany: 'Công ty X',
    totalPayment: 430000,
    orderDate: '26/09/2023',
    updateDate: '26/09/2023',
    status: 'Đã hủy'
  },
  {
    key: '4',
    services: [{ id: '2', nameService: 'Công ty hàng đầu', quantity: 3 }],
    nameCompany: 'Công ty X',
    totalPayment: 440000,
    orderDate: '26/09/2023',
    updateDate: '26/09/2023',
    status: 'Đã thanh toán'
  }
]
const columns: ColumnsType<DataType> = [
  {
    ellipsis: true,
    title: 'ID',
    dataIndex: 'key',
    key: 'key',
    render: (value, _) => <span key={value}>{`OD_${value}`}</span>
  },
  {
    ellipsis: true,
    title: 'Dịch vụ',
    dataIndex: 'services',
    key: 'services',
    render: (value, { services }) => (
      <div key={value}>
        {services.map((item) => (
          <p
            key={item.id}
            // style={{
            //   color: 'red',
            //   maxWidth: '300px',
            //   whiteSpace: 'nowrap',
            //   overflow: 'hidden',
            //   textOverflow: 'ellipsis'
            // }}
          >
            {`${item.nameService} X${item.quantity}`}
          </p>
        ))}
      </div>
    )
  },
  {
    ellipsis: true,
    title: 'Khách hàng',
    dataIndex: 'nameCompany',
    key: 'nameCompany'
  },
  {
    ellipsis: true,
    title: 'Tổng tiền',
    dataIndex: 'totalPayment',
    key: 'totalPayment',
    render: (value, _) => <span key={value}>{value.toLocaleString('vi', { currency: 'VND' })}</span>
  },
  {
    ellipsis: true,
    title: 'Ngày đặt hàng',
    key: 'orderDate',
    dataIndex: 'orderDate'
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
        {status === 'Chờ thanh toán' && <Tag color={'orange'}>{status}</Tag>}
        {status === 'Đã thanh toán' && <Tag color={'cyan'}>{status}</Tag>}
        {status === 'Hoàn tất' && <Tag color={'green'}>{status}</Tag>}
        {status === 'Đã hủy' && <Tag color={'red'}>{status}</Tag>}
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
      <Space size={'middle'}>
        <a style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <BsFillEyeFill />
        </a>

        {record.status === 'Đã thanh toán' && (
          <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <AiFillCheckCircle />
          </a>
        )}
        {record.status === 'Chờ thanh toán' && (
          <a style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <BsFillTrashFill />
          </a>
        )}
      </Space>
    )
  }
]
const OrdersManage = () => {
  const [listOrders, setListOrders] = useState<AnyType[]>([])
  const limit = 2
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(1)

  useEffect(() => {
    fetchGetOrders()
  }, [])
  const fetchGetOrders = async (page?: string) => {
    let param: OrderSearchByAdmin = { limit: limit.toString(), page: page ? page : '1', sort_by_date: '1', status: '' }
    await apiAdmin.getAllOrders(param).then((rs) => {
      console.log('Rs', rs)
    })
  }

  const onChangeTab = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: 'tab-all',
      label: <div className='tab-item'>Tất cả</div>,
      children: <></>
    },
    {
      key: 'tab-pending',
      label: <div className='tab-item'>Chờ thanh toán</div>,
      children: <></>
    },
    {
      key: 'tab-done-payment',
      label: <div className='tab-item'>Đã thanh toán</div>,
      children: <></>
    },
    {
      key: 'tab-done',
      label: <div className='tab-item'>Hoàn tất</div>,
      children: <></>
    },
    {
      key: 'tab-canceled',
      label: <div className='tab-item'>Đã hủy</div>,
      children: <></>
    }
  ]
  return (
    <div className='order-manage-page-container admin-users-manage-container'>
      <div className='title'>Quản lý đơn hàng</div>
      <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='1' items={items} />
      <div className='content-wapper'>
        {/* <Row style={{ gap: '10px', marginBottom: '15px' }}>
          <Col md={8} sm={16} xs={24}>
            <Input
              className='input-search-services'
              size='large'
              placeholder='ID, tên khách hàng'
              prefix={<FiSearch />}
            />
          </Col>
          <Col md={6} sm={16} xs={24}>
            <RangePicker
              style={{ width: '100%' }}
              size='large'
              placeholder={['Từ ngày', 'Đến ngày']}
              format='DD-MM-YYYY'
             
            />
          </Col>
        </Row> */}

        <Table className='table-custom users-table' scroll={{ x: true }} columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default OrdersManage
