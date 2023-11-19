import { Modal, Table, Tabs, Tag } from 'antd'
import './style.scss'
import { useState, useEffect } from 'react'
import apiAdmin from '~/api/admin.api'
import apiCompany from '~/api/company.api'
import apiOrder from '~/api/order.api'
import { StatusOrder } from '~/types/order.type'
import { TabsProps } from 'antd/lib'
import { format, parseISO } from 'date-fns'
import { ColumnsType } from 'antd/es/table'
interface AnyType {
  [key: string]: any
}
interface DetailOrderType {
  _id: string
  order: any
  packages: AnyType[]
  service_orders: AnyType[]
}
const items: TabsProps['items'] = [
  {
    key: 'detail',
    label: <div className='tab-item'>Chi tiết đơn hàng</div>,
    children: <></>
  },
  {
    key: 'transactions',
    label: <div className='tab-item'>Giao dịch</div>,
    children: <></>
  }
]
const ModalDetailOrder = (props: any) => {
  const { idOrder, isModalOpen, handleCloseModal, roleType, transactions } = props
  const [detailData, setDetailData] = useState<DetailOrderType>()
  const [listServices, setListServices] = useState<AnyType[]>([])
  const [detailCompany, setDetailCompany] = useState<AnyType>()
  const [totalPayment, setTotalPayment] = useState(0)
  const [tab, setTab] = useState('detail')
  useEffect(() => {
    if (isModalOpen) fetchData()
  }, [isModalOpen])
  const fetchData = async () => {
    if (roleType === 'ADMIN_TYPE') {
      await apiAdmin.getDetailOrderById(idOrder).then(async (rs) => {
        setDetailData(rs.result)
        await apiCompany.getDetailCompany(rs.result.order.company_id).then((rs) => {
          setDetailCompany(rs.result)
        })
        const listTemp: AnyType[] = []
        let totalTemp = 0
        rs.result.service_orders.map((service: AnyType) => {
          rs.result.packages.map((pkg: AnyType) => {
            if (pkg._id === service.package_id) {
              totalTemp += pkg.discount_price * service.quantity
              listTemp.push({
                name: `#SV_${pkg._id.slice(-5).toUpperCase()} - ${pkg.title}`,
                price: pkg.discount_price,
                quantity: service.quantity
              })
            }
          })
        })
        setTotalPayment(totalTemp)

        setListServices(listTemp)
      })
    } else {
      await apiOrder.getDetailOrder(idOrder).then(async (rs) => {
        setDetailData(rs.result)
        await apiCompany.getDetailCompany(rs.result.order.company_id).then((rs) => {
          setDetailCompany(rs.result)
        })
        const listTemp: AnyType[] = []
        let totalTemp = 0
        rs.result.service_orders.map((service: AnyType) => {
          rs.result.packages.map((pkg: AnyType) => {
            if (pkg._id === service.package_id) {
              totalTemp += pkg.discount_price * service.quantity
              listTemp.push({
                name: `#SV_${pkg._id.slice(-5).toUpperCase()} - ${pkg.title}`,
                price: pkg.discount_price,
                quantity: service.quantity
              })
            }
          })
        })
        setTotalPayment(totalTemp)

        setListServices(listTemp)
      })
    }
  }
  const onChangeTab = (key: string) => {
    setTab(key)
  }
  const columns: ColumnsType<any> = [
    {
      title: 'Mã GD',
      dataIndex: 'bill_number',
      key: 'bill_number'
    },
    // {
    //   title: 'Mã ngân hàng',
    //   dataIndex: 'bank_code',
    //   key: 'bank_code'
    // },
    {
      title: 'Thời gian GD',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (_, record) => <>{format(parseISO(record.updated_at), 'dd-MM-yyyy HH:mm:ss')}</>
    },
    {
      title: 'Thành tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, _) => <span key={value}>{(Number(value) / 100).toLocaleString('vi', { currency: 'VND' })}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'transaction_status',
      key: 'transaction_status',
      render: (value, _) => (
        <span key={value}>
          {value.toString() === '00' ? <Tag color='green'>Thành công</Tag> : <Tag color='red'>Thất bại</Tag>}
        </span>
      )
    }
  ]
  if (!detailData || !detailCompany) return <></>
  return (
    <Modal
      width={700}
      className='modal-detail-order'
      title={
        <h2 style={{ borderBottom: '1px solid gray', paddingBottom: '15px' }}>
          Chi tiết đơn hàng #OD_{idOrder.slice(-5).toUpperCase()}
        </h2>
      }
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer=''
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs onChange={onChangeTab} className='tabs-users-manage' defaultActiveKey='tab-all' items={items} />
        <div className='order-id'>Mã đơn hàng: #OD_{idOrder.slice(-5).toUpperCase()}</div>
      </div>
      <div className='content-modal-detail-container'>
        {/* <div style={{ fontWeight: 500, fontSize: '12px', borderBottom: '1px solid black' }}>
          <h2 style={{ textAlign: 'start', fontWeight: 700 }}>HFWORKS</h2>
          <p>Mã số thuế: 0000000000-000</p>
          <p>Địa chỉ: 12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh, Việt Nam</p>
          <p>Điện thoại: 0365887759</p>
          <p>Số tài khoản: 1030701534 - Vietcombank - Ngân hàng thương mại cổ phần Ngoại thương Việt Nam</p>
        </div>
        <div>
          <h1 style={{ fontWeight: 700, textAlign: 'center', marginBottom: '0' }}>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h1>
          <p style={{ textAlign: 'center', marginBottom: '0', color: 'red' }}>(Bản thể hiện của hóa đơn điện tử)</p>
          <p style={{ textAlign: 'center', marginBottom: '0' }}>Ngày ... tháng ... năm ...</p>
        </div> */}

        {tab === 'transactions' && transactions && (
          <div>
            {transactions.length > 0 ? (
              <Table
                pagination={false}
                rowKey={'_id'}
                className='table-custom users-table'
                scroll={{ x: true }}
                columns={columns}
                dataSource={transactions}
              />
            ) : (
              <>Không có giao dịch gần đây</>
            )}
          </div>
        )}
        {tab === 'detail' && (
          <div className='info-company-wapper'>
            <div className='title'>Thông tin khách hàng</div>
            <div className='name'>Tên khách hàng: {detailCompany.company_name}</div>
            <div className='name'>
              Địa chỉ:{' '}
              {detailCompany.working_locations.map((loc: any, index: number) => (
                <div key={index} style={{ paddingLeft: '20px' }}>
                  {loc.address}, {loc.district}, {loc.city_name}{' '}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'detail' && (
          <div className='info-order-wapper'>
            <div className='title-service'>Danh sách dịch vụ</div>
            <div className='list-services'>
              <div className='service-item header'>
                <div className='name-service'>Dịch vụ</div>
                <div className='price'>Giá</div>
                <div className='quantity'>Sô lượng</div>
                <div className='total '>Thành tiền</div>
              </div>
              {listServices &&
                listServices.map((service, index) => (
                  <div className='service-item' key={index}>
                    <div className='name-service'>{service.name}</div>
                    <div className='price'>{service.price.toLocaleString('vi', { currency: 'VND' })} đ</div>
                    <div className='quantity'>x {service.quantity}</div>
                    <div className='total '>
                      {(service.quantity * service.price).toLocaleString('vi', { currency: 'VND' })} đ
                    </div>
                  </div>
                ))}
            </div>
            <div className='order-detail-info'>
              <div className='left-content'>
                <div className='title'>Chi tiết đơn hàng: </div>
                <div className='order-date'>Ngày đặt hàng: {detailData.order.created_at.slice(0, 10)}</div>
                <div className='update-date'>Cập nhật gần đây: {detailData.order.updated_at.slice(0, 10)}</div>
                <div className='update-date'>
                  Trạng thái đơn hàng: {Object.values(StatusOrder)[Number(detailData.order.status)]}
                </div>
              </div>
              <div className='right-content'>
                <div className='item'>
                  <div className='label'>Tổng tiền(Chưa VAT)</div>
                  <div className='value'>{totalPayment.toLocaleString('vi', { currency: 'VND' })} VND</div>
                </div>
                <div className='item'>
                  <div className='label'>Tổng tiền(Đã bao gồm VAT)</div>
                  <div className='value'>
                    {(totalPayment * 0.1 + totalPayment).toLocaleString('vi', { currency: 'VND' })} VNĐ
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === 'detail' && (
          <div className='footer-modal-container'>
            <span>Thành tiền: {(totalPayment * 0.1 + totalPayment).toLocaleString('vi', { currency: 'VND' })} VNĐ</span>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalDetailOrder
