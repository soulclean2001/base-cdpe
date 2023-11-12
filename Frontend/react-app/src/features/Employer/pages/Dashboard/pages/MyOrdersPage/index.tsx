import { Col, Input, Row, Space, Table, Tabs, Tag, Tooltip } from 'antd'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker
import '~/features/Admin/contents/OrdersManage/style.scss'
import { BsFillEyeFill, BsFillTrashFill } from 'react-icons/bs'
import './style.scss'
import { ColumnsType } from 'antd/es/table'

import { TabsProps } from 'antd/lib'
import { FiSearch } from 'react-icons/fi'
import { toast } from 'react-toastify'
import apiOrder, { RequestSearchOrderType } from '~/api/order.api'
import apiAdmin from '~/api/admin.api'
import '../MyServicesPage/style.scss'
import { MdPayments } from 'react-icons/md'
import { useEffect, useState } from 'react'
import CreatePayment from '../../../CartPage/components/VNPAY/CreatePayment'
import { AiFillCheckCircle } from 'react-icons/ai'
import ModalDetailOrder from './components/ModalDetailOrder'
interface OrderAnyType {
  [key: string]: any
}
interface ServiceType {
  id: string
  nameService: string
  quantity: number
  idService_order: string
}
interface DataType {
  id: string
  services: ServiceType[]
  nameCompany?: string
  totalPayment: string | number
  orderDate: string
  updateDate: string
  status: string
}

const MyOrdersPage = (props: any) => {
  const { roleType } = props

  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
  const [idOrder, setIdOrder] = useState('')
  const litmit = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [listOrders, setListOrders] = useState<DataType[]>([])
  const [status, setStatus] = useState('')
  const [totalElement, setTotalElement] = useState(1)
  //   const [date, setDate] = useState('')
  useEffect(() => {
    setCurrentPage(1)
    fetchGetMyOrders()
  }, [status])
  const fetchGetMyOrders = async (page?: string) => {
    let request: RequestSearchOrderType = {
      limit: litmit.toString(),
      page: page ? page : '1',
      status: status,
      sort_by_date: '-1'
    }
    if (roleType === 'ADMIN_TYPE') {
      await apiAdmin.getAllOrders(request).then((rs) => {
        console.log('rs', rs)
        let listOrdersTemp: DataType[] = []
        let company = 'name'
        listOrdersTemp = rs.result.orders.map((order: OrderAnyType) => {
          company = `#KH_${order.company._id.slice(-5).toUpperCase()} - ${order.company.company_name}`
          let packagesTemp: ServiceType[] = []
          order.service_orders.map((service: OrderAnyType) => {
            order.packages.map((pkg: OrderAnyType) => {
              if (pkg._id === service.package_id) {
                packagesTemp.push({
                  id: pkg._id,
                  nameService: `${pkg.title}-${pkg.number_of_days_to_expire} ngày`,
                  quantity: service.quantity,
                  idService_order: service._id
                })
              }
            })
          })
          return {
            id: order._id,
            nameCompany: company,
            status: order.order.status.toString(),
            services: packagesTemp,
            totalPayment: order.order.total,
            orderDate: order.order.created_at.slice(0, 10),
            updateDate: order.order.updated_at.slice(0, 10)
          }
        })
        console.log('listOrdersTemp', listOrdersTemp)
        setListOrders(listOrdersTemp)
        setTotalElement(rs.result.total)
      })
    } else {
      await apiOrder.getAllByMe(request).then((rs) => {
        console.log('rs', rs)
        let listOrdersTemp: DataType[] = []
        listOrdersTemp = rs.result.orders.map((order: OrderAnyType) => {
          let packagesTemp: ServiceType[] = []
          order.service_orders.map((service: OrderAnyType) => {
            order.packages.map((pkg: OrderAnyType) => {
              if (pkg._id === service.package_id) {
                packagesTemp.push({
                  id: pkg._id,
                  nameService: `${pkg.title}-${pkg.number_of_days_to_expire} ngày`,
                  quantity: service.quantity,
                  idService_order: service._id
                })
              }
            })
          })
          return {
            id: order._id,
            status: order.order.status.toString(),
            services: packagesTemp,
            totalPayment: order.order.total,
            orderDate: order.order.created_at.slice(0, 10),
            updateDate: order.order.updated_at.slice(0, 10)
          }
        })
        console.log('listOrdersTemp', listOrdersTemp)
        setListOrders(listOrdersTemp)
        setTotalElement(rs.result.total)
      })
    }
  }
  const handleActiveServicesInOrderSuccess = async (orderId: string) => {
    await apiAdmin
      .activeServicesByOrderId(orderId)
      .then(async () => {
        await fetchGetMyOrders(currentPage.toString())
        toast.success('Đơn hàng đã chuyển sang trạng thái Hoàn tất')
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
      })
  }
  const handleCancelOrder = async (orderId: string) => {
    await apiAdmin
      .cancelOrderById(orderId)
      .then(async () => {
        await fetchGetMyOrders(currentPage.toString())
        toast.success('Đơn hàng đã chuyển sang trạng thái Đã hủy')
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
      })
  }

  const handleChangePage = async (e: number) => {
    setCurrentPage(e)
    await fetchGetMyOrders(e.toString())
  }
  const onChangeTab = (key: string) => {
    setStatus(key === 'tab-all' ? '' : key)
    console.log(key)
  }
  const handleOpenModal = (id: string) => {
    setIdOrder(id)
    setIsOpenModalDetail(true)
  }
  const handleCloseModal = () => {
    setIsOpenModalDetail(false)
  }
  const columns: ColumnsType<DataType> = [
    {
      ellipsis: true,
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value, _) => <span key={value}>{`#OD_${value.slice(-5).toUpperCase()}`}</span>
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
      title: <div>{roleType === 'ADMIN_TYPE' ? 'Khách hàng' : ''}</div>,
      dataIndex: 'nameCompany',
      key: 'nameCompany',
      render: (_, record) => <span key={record.id}>{roleType === 'ADMIN_TYPE' ? record.nameCompany : ''}</span>
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
      render: (_, record) => (
        <>
          {record.status.toString() === '4' && <Tag color={'orange'}>Chờ thanh toán</Tag>}
          {record.status.toString() === '5' && <Tag color={'cyan'}>Đã thanh toán</Tag>}
          {record.status.toString() === '2' && <Tag color={'green'}>Hoàn tất</Tag>}
          {record.status.toString() === '1' && <Tag color={'red'}>Đã hủy</Tag>}
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
          <Tooltip title='Chi tiết'>
            <a
              onClick={() => handleOpenModal(record.id)}
              style={{ fontSize: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
            >
              <BsFillEyeFill />
            </a>
          </Tooltip>

          {record.status.toString() === '5' && roleType === 'ADMIN_TYPE' && (
            <Tooltip title='Hoàn tất'>
              <a
                onClick={() => handleActiveServicesInOrderSuccess(record.id)}
                style={{ fontSize: '14px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
              >
                <AiFillCheckCircle />
              </a>
            </Tooltip>
          )}
          {record.status.toString() === '4' && (
            <>
              {roleType !== 'ADMIN_TYPE' ? (
                <Tooltip title='Thanh toán'>
                  <CreatePayment orderId={record.id} />
                </Tooltip>
              ) : (
                <Tooltip title='Hủy đơn'>
                  <a
                    onClick={() => handleCancelOrder(record.id)}
                    style={{ fontSize: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}
                  >
                    <BsFillTrashFill />
                  </a>
                </Tooltip>
              )}
            </>
          )}
        </Space>
      )
    }
  ]
  const items: TabsProps['items'] = [
    {
      key: 'tab-all',
      label: <div className='tab-item'>Tất cả</div>,
      children: <></>
    },
    {
      key: '4',
      label: <div className='tab-item'>Chờ thanh toán</div>,
      children: <></>
    },
    {
      key: '5',
      label: <div className='tab-item'>Đã thanh toán</div>,
      children: <></>
    },
    {
      key: '2',
      label: <div className='tab-item'>Hoàn tất</div>,
      children: <></>
    },
    {
      key: '1',
      label: <div className='tab-item'>Đã hủy</div>,
      children: <></>
    }
  ]
  return (
    <div className='order-manage-page-container admin-users-manage-container my-orders-page-container'>
      <div className='title'>{roleType === 'ADMIN_TYPE' ? 'Quản lý đơn hàng' : 'Quản lý đơn hàng của tôi'}</div>
      <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='tab-all' items={items} />
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
            <DatePicker
              style={{ width: '100%' }}
              size='large'
              placeholder={'Ngày đặt hàng'}
              format='YYYY-MM-DD'
              // locale={viVN}
              onChange={(_, string) => setDate(string)}
            />
          </Col>
        </Row> */}

        <Table
          pagination={{
            current: currentPage,
            pageSize: litmit,
            total: totalElement,
            onChange: handleChangePage
          }}
          rowKey={'id'}
          className='table-custom users-table'
          scroll={{ x: true }}
          columns={columns}
          dataSource={listOrders}
        />
        <ModalDetailOrder
          roleType={roleType}
          idOrder={idOrder}
          isModalOpen={isOpenModalDetail}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </div>
  )
}

export default MyOrdersPage
